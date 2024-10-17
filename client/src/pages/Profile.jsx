import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFaliure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserFaliure,
  signoutUserStart,
  signoutUserSuccess,
  updateUserFaliure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSilce";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([])
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success === false) {
      dispatch(updateUserFaliure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
  };

  const handelDeleteUser = async () => {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFaliure(data.message));
      return;
    }
    dispatch(deleteUserSuccess());
  };

  const handleSignout = async () => {
    dispatch(signoutUserStart());
    const res = await fetch("/api/auth/signout");
    const data = await res.json();
    if (data.success === false) {
      dispatch(signoutUserFaliure());
      return;
    }
    dispatch(signoutUserSuccess());
  };

  const handleShowListings = async()=>{
    setShowListingError(false);
    const res = await fetch(`/api/user/listings/${currentUser._id}`)
    const data = await res.json(); 
    if(data.success === false){
      setShowListingError(true);
      return;
    }
    setUserListings(data); 
    console.log(data);
  }

  const handleDeleteListing = async(listingId)=>{
     const res = await fetch(`/api/listing/delete/${listingId}`,{
      method: 'DELETE',
     })
     const data = await res.json();
     if(data.success === false){
      console.log(data.message)
      return;
     }
     setUserListings((prev)=> prev.filter((listing)=> listing._id !== listingId))
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Sucessfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handelDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p>{showListingError ? "Unauthorized" : ""}</p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain "
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p className="">{listing.name}</p>
              </Link>
              <div className="flex flex-col item-center ">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 uppercase "
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-red-green  uppercase ">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
