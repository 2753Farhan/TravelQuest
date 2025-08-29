export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center w-10 h-10  rounded-xl group-hover:shadow-lg transition-all duration-300">
              <img
                src="/logo.png"
                alt="Cefalo Travel Connect Logo"
                className="w-7 h-7 object-contain"
              />
            </div>

            <p className="text-gray-400 mt-1">Explore the world with your colleagues</p>
          </div>
          <div className="flex space-x-6">
            <FooterLink href="#" text="Terms" />
            <FooterLink href="#" text="Privacy" />
            <FooterLink href="#" text="Contact" />
          </div>
        </div>
        <div className="mt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Cefalo Travel Connect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

const FooterLink = ({ href, text }: { href: string; text: string }) => (
  <a href={href} className="text-gray-300 hover:text-primary-400 transition-colors">
    {text}
  </a>
);