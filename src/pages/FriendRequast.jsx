import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getDatabase, ref, onValue, remove, set } from "firebase/database";
import { useSelector } from "react-redux";

const FriendRequast = () => {
  // Get current user data from Redux
  const sliseCurrentuser = useSelector((state) => state.prity.peraDitase);

  // State to store request data
  const [requstdata, uprequstdata] = useState([]);

  // Firebase database instance
  const db = getDatabase();

  // Fetch friend request data in real-time from Firebase
  useEffect(() => {
    const starCountRef = ref(db, "friendRequastList/");
    onValue(starCountRef, (snapshot) => {
      let kamerBAG = [];
      snapshot.forEach((namThikama) => {
        if (namThikama.val().ReseverId === sliseCurrentuser.uid) {
          kamerBAG.push({ ...namThikama.val(), key: namThikama.key });
        }
      });

      uprequstdata(kamerBAG);
    });
  }, [db, sliseCurrentuser.uid]);

  // Handle Confirm button click
  const handelConfirmButton = (confirmData) => {
    console.log(confirmData);

    // Add friendship for the current user
    const friendDataForCurrentUser = {
      friendId: confirmData.senderId,
      friendName: confirmData.senderName,
      friendPhoto: confirmData.senderPhoto,
    };

    // Add friendship for the sender of the request
    const friendDataForSender = {
      friendId: sliseCurrentuser.uid,
      friendName: sliseCurrentuser.displayName,
      friendPhoto: sliseCurrentuser.photoURL,
    };

    // Add to the current user's friends list
    set(ref(db, `friends/${sliseCurrentuser.uid}/${confirmData.senderId}`), friendDataForCurrentUser);

    // Add to the sender's friends list
    set(ref(db, `friends/${confirmData.senderId}/${sliseCurrentuser.uid}`), friendDataForSender);

    // Remove the friend request after confirming
    remove(ref(db, 'friendRequastList/' + confirmData.key));
  };

  // Handle Delete button click
  const handelDeleteButton = (confirmData) => {
    // Remove the friend request from the list
    remove(ref(db, 'friendRequastList/' + confirmData.key));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-[900px] bg-gradient-to-r from-[#71ffe3] via-[#fff] to-[#008cff] flex flex-col items-center py-10">
        <h2 className="text-3xl font-bold text-black w-full text-center pt-5 pb-5 mb-8 shadow-lg">
          All Friend Requests
        </h2>
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-lg p-6">
          {requstdata.map((SOBdata) => (
            <div
              key={SOBdata.key}
              className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out rounded-lg"
            >
              <div className="flex items-center">
                <img
                  src={SOBdata?.senderPhoto}
                  alt="profile"
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shadow-sm"
                />
                <span className="ml-5 text-gray-800 font-semibold text-lg">
                  {SOBdata?.senderName}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handelConfirmButton(SOBdata)}
                  className="bg-gradient-to-r from-[#49e751] to-[#0f8] active:scale-95 text-white px-5 py-2 rounded-full shadow-lg hover:from-[#0f8] hover:to-[#49e751] transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handelDeleteButton(SOBdata)}
                  className="bg-gradient-to-r from-[#f00] to-[#ff00aa] active:scale-95 text-white px-5 py-2 rounded-full shadow-lg hover:from-[#ff00aa] hover:to-[#f00] transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FriendRequast;
