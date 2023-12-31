import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import { convertBytes, getPercentageStorage } from "../utils/helper";
import axios from 'axios'

export default function UserStorage({ updateUI }) {
  const [storage, setStorage] = useState('')
  const [percentage, setPercentage] = useState('')
  const auth = useAuth()

  const fetchStorage = () => {
    axios.get(`${process.env.REACT_APP_STORAGE_SERV}/api/storage/user/${auth.user?._id}`)
      .then((res) => {
        setStorage(convertBytes(res.data?.data.totalStorage))
        setPercentage(getPercentageStorage(res.data?.data.totalStorage, 10485760).toFixed(2))

      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchStorage()
  }, [updateUI])

  return (
    <>
      <div className="p-3 border rounded-lg h-full border-emerald-400 mb-4 w-full mr-3 flex items-center">
        <div className="w-full">

          <div className="flex">
            <p>Storage</p>
            <p className="ml-auto">{storage ? storage : 0} Used of 10MB</p>
          </div>
          <div class="w-full bg-emerald-200 mt-2 rounded-full h-5 dark:bg-gray-700">
            <div class="bg-emerald-600 h-5 rounded-full" style={{ width: `${percentage ? percentage : 0}%` }}></div>
          </div>
        </div>
      </div>
    </>
  );
}
