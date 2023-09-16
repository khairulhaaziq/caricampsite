class ApplicationController < ActionController::API
  include ActionController::RequestForgeryProtection
  protect_from_forgery with: :null_session

  def error_json(status_code, custom_message = nil, data = {})
    case status_code
    when 400
      msg = "Bad request"
    when 401
      msg = "Unauthorized"
    when 403
      msg = "You are not authorized to perform this action"
    when 404
      msg = "Record not found"
    end

    {message: custom_message || msg, code: status_code, data: data}
  end

  def success_json(message = "success", data = {})
    {message: message, code: 200, data: data}
  end

  def render_success
    render json: success_json, status: :ok
  end

  def render_serializer(serializer, obj, options = {})
    if obj
      # standard:disable Style/ClassEqualityComparison
      if obj.class.name == "ActiveRecord::AssociationRelation" || obj.class.name == "ActiveRecord::Relation"
        return render_collection_serializer(serializer, obj, options) unless options[:meta] && options[:meta][:pagination]
      end
      # standard:enable Style/ClassEqualityComparison

      render_single_serializer(serializer, obj, options)
    else
      error_json(404)
    end
  end

  private

  def render_collection_serializer(serializer, collection, options = {})
    options = meta_pagination(collection, options)
    render_single_serializer(serializer, collection, options)
  end

  def render_single_serializer(serializer, record, options = {})
    json = serializer.new(record, options).serializable_hash
    json.merge({code: 200})
  end

  def meta_pagination(paginated_obj, options = {})
    options[:meta] = {} unless options.has_key?(:meta)
    meta_options = options[:meta].merge(generate_pagination(paginated_obj))
    options[:meta] = meta_options
    options
  end

  def generate_pagination(paginated_obj)
    {
      pagination: {
        current_page: paginated_obj.current_page,
        prev_page: paginated_obj.prev_page,
        next_page: paginated_obj.next_page,
        total_pages: paginated_obj.total_pages,
        total_count: paginated_obj.total_count
      }
    }
  end

  def set_current_user
    @current_user = User.find_by(id: doorkeeper_token[:resource_owner_id])
    render json: error_json(401, "Unauthorized"), status: 401 unless @current_user
  end
end
