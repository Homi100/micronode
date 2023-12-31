import React from 'react'

export default function Footer() {
  return (
    <>
    <footer class="text-gray-600 body-font bg-black mt-28" >
  <div class="container px-5 py-5 mx-auto flex items-center sm:flex-row flex-col">
    <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
      {/*<svg xmlns="logo nuvexa.png" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24"> */}

        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      {/* </svg> */}
      <img src="logo nuvexa.png" class="h-8" alt="NUVEXA LOGO Logo" />
      <span class="ml-3 text-xl text-white">Nuvexa</span>
    </a>
    
    <p className='ml-auto text-white'>© 2023 Nuvexa Photos</p>
    
   
  </div>
</footer>
    </>
  )
}
