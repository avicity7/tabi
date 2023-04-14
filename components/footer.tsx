const Footer = () => {
  return (
        <footer className="bg-white">
          <div className="font-DMSans grid grid-cols-2 gap-0 lg:gap-8 px-6 py-8 lg:grid-cols-4 justify-items-center">
              <div className="flex flex-col align-center w-full">
                  <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase">TABI</h2>
                  <ul className="text-gray-500 ">
                      <li className="mb-4">
                          <a href="#" className=" hover:underline">About</a>
                      </li>
                      <li className="mb-4">
                          <a href="#" className="hover:underline">Blog</a>
                      </li>
                  </ul>
              </div>
              <div className="flex flex-col align-center w-full">
                  <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase ">Help center</h2>
                  <ul className="text-gray-500 ">
                      <li className="mb-4">
                          <a href="#" className="hover:underline">Twitter</a>
                      </li>
                      <li className="mb-4">
                          <a href="#" className="hover:underline">Contact Us</a>
                      </li>
                  </ul>
              </div>
              <div className="flex flex-col align-center w-full">
                  <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase ">Legal</h2>
                  <ul className="text-gray-500 ">
                      <li className="mb-4">
                          <a href="#" className="hover:underline">Privacy Policy</a>
                      </li>
                      <li className="mb-4">
                          <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                      </li>
                  </ul>
              </div>
              <div className="flex flex-col align-center w-full">
                  <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase ">Download</h2>
                  <ul className="text-gray-500 ">
                      <li className="mb-4">
                          <a href="#" className="hover:underline">iOS</a>
                      </li>
                      <li className="mb-4">
                          <a href="#" className="hover:underline">Android</a>
                      </li>
                  </ul>
              </div>
          </div>
          <div className="font-DMSans px-4 py-6 bg-gray-100  md:flex md:items-center md:justify-between">
              <span className="text-sm text-gray-500 sm:text-center">© 2023 <a href="#">tabi™</a>. All Rights Reserved.
              </span>
          </div>
      </footer>
  )
}

export default Footer
