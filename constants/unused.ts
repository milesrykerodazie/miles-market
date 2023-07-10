import slugify from 'slugify';

// const [selectedFiles, setSelectedFiles] = useState([]);
// const [previewUrls, setPreviewUrls] = useState<string[]>([]);
// const [convertedImages, setConvertedImages] = useState<string[]>([]);

//images state
// const [selectedFiles, setSelectedFiles] = useState<FileList | []>([]);
// const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//image onchange
// const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//    const files = event.target.files;
//    const allFiles = selectedFiles
//       ? [...Array.from(selectedFiles), ...Array.from(files!)]
//       : Array.from(files!);

//    //@ts-expect-error
//    setSelectedFiles(allFiles);

//    // Generate preview URLs for all the selected files
//    const urls = allFiles.map((file) => URL.createObjectURL(file));
//    setPreviewUrls(urls);
// };

//handle remove unwanted images
// const removeImage = (index: number) => {
//    // Remove the image at the specified index from the selected files and preview URLs

//    const updatedFiles = Array.from(selectedFiles || []);
//    updatedFiles.splice(index, 1);
//    //@ts-expect-error
//    setSelectedFiles(updatedFiles);

//    const updatedUrls = [...previewUrls];
//    updatedUrls.splice(index, 1);
//    setPreviewUrls(updatedUrls);
// };

//handle image onChange, appending new selected files to the already selected files and converting the files to base 64.Also the function handles the image preview as well
// const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//    const files = event.target.files;
//    const updatedSelectedFiles = selectedFiles ? [...selectedFiles] : [];

//    // Append the newly selected files to the existing selected files
//    for (let i = 0; i < files!.length; i++) {
//       //@ts-expect-error
//       updatedSelectedFiles.push(files[i]);
//    }
//    setSelectedFiles(updatedSelectedFiles);

//    // Generate preview URLs for all the selected files
//    const urls = updatedSelectedFiles.map((file) =>
//       URL.createObjectURL(file),
//    );
//    setPreviewUrls(urls);

//    // Convert all the selected files to base64
//    const converted = updatedSelectedFiles.map((file) => {
//       return new Promise<string>((resolve, reject) => {
//          const reader = new FileReader();
//          reader.onloadend = () => {
//             const base64String = reader.result as string;
//             resolve(base64String);
//          };
//          reader.onerror = reject;
//          reader.readAsDataURL(file);
//       });
//    });

//    Promise.all(converted).then((base64Images) => {
//       setConvertedImages(base64Images);
//    });
// };

// const removeImage = (index: number) => {
//    // Remove the image at the specified index from the selected files, preview URLs, and converted images
//    const updatedFiles = Array.from(selectedFiles || []);
//    updatedFiles.splice(index, 1);
//    setSelectedFiles(updatedFiles);

//    const updatedUrls = [...previewUrls];
//    updatedUrls.splice(index, 1);
//    setPreviewUrls(updatedUrls);

//    const updatedConvertedImages = [...convertedImages];
//    updatedConvertedImages.splice(index, 1);
//    setConvertedImages(updatedConvertedImages);
// };

// const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//    const files = event.target.files;
//    if (files) {
//       const selectedImages = Array.from(files);
//       setProduct((prevFormData) => ({
//          ...prevFormData,
//          productImages: [...prevFormData.productImages, ...selectedImages],
//       }));
//    }
// };

// const removeImage = (index: number) => {
//    setProduct((prevFormData) => {
//       const updatedImages = [...prevFormData.productImages];
//       updatedImages.splice(index, 1);
//       return {
//          ...prevFormData,
//          productImages: updatedImages,
//       };
//    });
// };

// const onChange = (
//    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
// ) => {
//    setProduct({...product, [e.target.name]: e.target.value});
// };

// const handleLogin = () => {
//    setIsLoading(true);

//    //authenticating user
//    axios
//       .post(`${BASE_API_URL}/auth/sign-in`, loginData, {
//          headers: {'Content-Type': 'application/json'},
//          withCredentials: true,
//       })
//       .then((response) => {
//          if (response?.data) {
//             console.log('login response => ', response.data);
//          }
//       })
//       .catch((error) => {
//          console.log('login error => ', error?.response?.data);
//       })
//       .finally(() => {
//          setIsLoading(false);
//       });
// };
