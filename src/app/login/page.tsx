import Image from "next/image";
import React from "react";
import PigeonImage from "../../../public/pigeon.png";
import LoginForm from "@/components/LoginForm";

export default function page() {
  return (
    <div className="h-screen w-full flex">
      <div className="w-1/2">
        <Image
          src={PigeonImage}
          alt="pigeon"
          width={500}
          height={500}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-4">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-primary">AGN</span>
          </h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
