import Image from "next/image";
import Avtar from "../../public/Images/avtar.png";

export default function Header() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-4 px-8 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Left Side: Welcome Message */}
        <p className="text-gray-700 text-lg font-medium hidden md:block">
          Good morning! Let art inspire your day ahead.
        </p>

        {/* Right Side: User Profile */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-blue-200 shadow-md">
            <Image
              src={Avtar}
              alt="User Avatar"
              width={40}
              height={40}
              className="object-cover h-full w-full"
            />
          </div>
          <p className="text-gray-800 font-semibold">Komal Ribadiya</p>
        </div>
      </div>
    </div>
  );
}
