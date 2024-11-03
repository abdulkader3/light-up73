import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";

const AddFriends = () => {
  const mainuser = useSelector((state) => state.prity.peraDitase);
  const db = getDatabase();

  const [jonogon, upjonogon] = useState([]);
  const [buttonStates, setButtonStates] = useState({});

  useEffect(() => {
    // Fetch all users except the main user
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      let bag = [];
      snapshot.forEach((notItem) => {
        if (notItem.val().uid !== mainuser.uid) {
          bag.push({ ...notItem.val(), key: notItem.key });
        }
      });
      upjonogon(bag);
    });
  }, [db, mainuser.uid]);

  useEffect(() => {
    // Fetch friend requests
    const friendRequestRef = ref(db, `friendRequastList/${mainuser.uid}`);
    onValue(friendRequestRef, (snapshot) => {
      const requestStatus = {};
      snapshot.forEach((item) => {
        requestStatus[item.val().ReseverId] = true; // True if friend request was sent
      });
      setButtonStates(requestStatus);
    });

    // Fetch friendships
    const friendsRef = ref(db, `friends/${mainuser.uid}`);
    onValue(friendsRef, (snapshot) => {
      const friendsStatus = {};
      snapshot.forEach((item) => {
        friendsStatus[item.key] = "friend";  // Set status as "friend"
      });
      setButtonStates((prevState) => ({
        ...prevState,
        ...friendsStatus,  // Merge friendship status
      }));
    });
  }, [db, mainuser.uid]);

  const addFrind = (thatFriend) => {
    set(ref(db, `friendRequastList/${mainuser.uid}`), {
      senderId: mainuser.uid,
      senderName: mainuser.displayName,
      senderPhoto: mainuser.photoURL,
      ReseverId: thatFriend.uid,
      ReseverName: thatFriend.username,
      ReseverPhoto: thatFriend.profile_picture,
    });
    buttonchange(thatFriend.uid, true);
  };

  const cancelFriendRequest = (thatFriend) => {
    const friendRequestRef = ref(db, `friendRequastList/${mainuser.uid}`);
    onValue(friendRequestRef, (snapshot) => {
      snapshot.forEach((item) => {
        if (item.val().ReseverId === thatFriend.uid) {
          remove(ref(db, `friendRequastList/${mainuser.uid}/${item.key}`));
        }
      });
    });
    buttonchange(thatFriend.uid, false);
  };

  const acceptFriendRequest = (thatFriend) => {
    const friendDataForMainUser = {
      friendId: thatFriend.uid,
      friendName: thatFriend.username,
      friendPhoto: thatFriend.profile_picture,
    };

    const friendDataForReceiver = {
      friendId: mainuser.uid,
      friendName: mainuser.displayName,
      friendPhoto: mainuser.photoURL,
    };

    // Add the friendship to both users' friend lists
    set(ref(db, `friends/${mainuser.uid}/${thatFriend.uid}`), friendDataForMainUser);
    set(ref(db, `friends/${thatFriend.uid}/${mainuser.uid}`), friendDataForReceiver);

    // Remove the friend request after acceptance
    removeFriendRequest(thatFriend.uid);

    // Show "Friend" label
    buttonchange(thatFriend.uid, "friend");
  };

  const buttonchange = (uid, status) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [uid]: status,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-[900px] bg-gradient-to-r from-[#71ffe3] via-[#fff] to-[#008cff] flex flex-col items-center py-10">
        <h2 className="text-3xl font-bold text-black w-full text-center pt-5 pb-5 mb-8 shadow-lg">
          All User
        </h2>
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-lg p-6">
          {jonogon.map((sobpolapain) => (
            <div
              key={sobpolapain.key}
              className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out rounded-lg"
            >
              <div className="flex items-center">
                <img
                  src={sobpolapain?.profile_picture}
                  alt={sobpolapain?.username}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shadow-sm"
                />
                <span className="ml-5 text-gray-800 font-semibold text-lg">
                  {sobpolapain?.username}
                </span>
              </div>
              {buttonStates[sobpolapain.uid] === "friend" ? (
                <span className="text-gray-500 font-semibold">Friend</span>
              ) : buttonStates[sobpolapain.uid] ? (
                <button
                  onClick={() => cancelFriendRequest(sobpolapain)}
                  className="bg-gradient-to-r from-green-400 active:scale-95 to-blue-500 text-white px-5 py-2 rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => addFrind(sobpolapain)}
                  className="bg-gradient-to-r from-green-400 active:scale-95 to-blue-500 text-white px-5 py-2 rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  Add Friend
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddFriends;
