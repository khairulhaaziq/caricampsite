import {
  useCallback,
  useEffect,
  useState
} from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageDropzone({ validate, defaultFileUrls }: {validate: ()=>void; defaultFileUrls?: string[]}) {
  const [files, setFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    if (defaultFileUrls)
      setFiles(()=>[...defaultFileUrls]);
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const form = new FormData();

    for (const file of acceptedFiles){
      const modifiedFileName = new Date().toISOString() + '_' + file.name;

      const modifiedFile = new File([file], modifiedFileName, {
        type: file.type,
      });

      form.append('image', modifiedFile);
    }

    await uploadFiles(form);
    validate();
  }, []);

  async function uploadFiles(form: FormData) {
    setIsLoading(true);
    let error = false;

    const result = await fetch('new/images',
      {
        method: 'POST',
        body: form,
      })
      .then(async (res) => {
        const json = await res.json();
        console.log(json);
        return json;
      })
      .catch((err) =>{
        error = true;
        console.error(err);
        return err;
      });

    if (!error) {
      result.result.fileUrls.forEach(fileUrl=>{
        setFiles((prevFiles) => [...prevFiles, { preview: fileUrl }]);
      });
    }

    setIsLoading(false);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const thumbs = files.map((file, index) => (
    <div key={index} className="relative">
      <img
        src={file.preview}
        className="aspect-square object-cover rounded-lg"
        // Revoke data uri after image is loaded
        onLoad={() => { URL.revokeObjectURL(file.preview); }}
      />
      <input
        type="hidden"
        hidden
        name={`images[${index}]`}
        value={file.preview}
      />
      <p className="absolute bottom-2 left-2">{file.fileName}</p>
    </div>
  ));

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {thumbs}
        {isLoading && (
          <div className="border-dashed border-2 border-neutral-200 bg-neutral-50 rounded-lg aspect-square flex-none items-center justify-center">
            'Uploading your image'
          </div>
        )}
        {files.length < 5 ? (
          <>
            {Array.from({ length: 5 - files.length }, (_, i) => i + 1).map((i)=>(
              <div
                key={i}
                className="border-dashed border-2 border-neutral-200 bg-neutral-50 rounded-lg aspect-square flex-none"
              >
                <div
                  {...getRootProps()}
                  className="flex items-center justify-center text-center h-full px-4"
                >
                  <input {...getInputProps()} />
                  {
                    isDragActive ?
                      <p>Drop the files here ...</p> :
                      <p className="text-neutral-600">Add a photo</p>
                  }
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="border-dashed border-2 border-neutral-200 bg-neutral-50 rounded-lg aspect-square flex-none">
            <div
              {...getRootProps()}
              className="flex items-center justify-center text-center h-full px-4"
            >
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  <p className="text-neutral-600">Add a photo</p>
              }
            </div>
          </div>
        )}
        <input
          type="hidden"
          hidden
          name="cover_image"
          value={files[0]?.preview}
          defaultValue="https://loremflickr.com/300/300"
        />
      </div>
    </>
  );
}
