"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Bottombar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        <Link href="/" className="bottombar_image">
          <Image
            src={pathname === "/" ? "/assets/icons/activeHome.svg" : "/assets/icons/home.svg"}
            alt="Home"
            width={24}
            height={24}
          />
          <p className="bottombar_text">Home</p>
        </Link>

        <Link href="/create-prompt" className="bottombar_image">
          <Image
            src={pathname === "/create-prompt" ? "/assets/icons/activeCreate.svg" : "/assets/icons/create.svg"}
            alt="Create Prompt"
            width={24}
            height={24}
          />
          <p className="bottombar_text">Create Prompt</p>
        </Link>
        <Link href="/profile" className="bottombar_image">
          <Image
            src={
              session?.user ? session.user.image : "/assets/icons/profile.svg"
            }
            alt="Profile"
            width={24}
            height={24}
            className="rounded-full"
          />
          <p className="bottombar_text">Profile</p>
        </Link>
      </div>
    </section>
  );
};

export default Bottombar;
