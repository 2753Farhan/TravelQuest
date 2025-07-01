export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Cefalo Travel Connect</h3>
            <p className="text-gray-400">Explore the world with your colleagues</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary-400">Terms</a>
            <a href="#" className="hover:text-primary-400">Privacy</a>
            <a href="#" className="hover:text-primary-400">Contact</a>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Cefalo Travel Connect. All rights reserved.
        </div>
      </div>
    </footer>
  )
}