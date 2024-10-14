import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { getStorage, uploadBytesResumable , ref, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + File.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) =>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },
      (error)=>{
        setFileUploadError(true);
      },
      () =>{
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) =>{
            setFormData({...FormData, avatar: downloadURL})
          }
        )
      }
    )
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full object-cover self-center h-24 w-24 cursor-pointer mt-2"
          src={formData.avatar || currentUser.avatar}
        />
        <p className="text-center text-sm">
          {fileUploadError ?
          (<span className="text-red-700">Error Image Upload</span>) :
          (
            filePerc > 0 && filePerc < 100 ?
            (<span className="text-slate-700">{`Uploading ${filePerc}%`}</span>) :
            (
              filePerc === 100 ? 
              (<span className="text-green-700">Image Sucessfully Uploaded!</span>) :
              ""
            )
            
          )
        }
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
