"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Mockup = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.8 }}
      className="flex justify-center items-center mb-20 mt-10 max-sm:px-6 fade-in-10 "
    >
      <Image
        src="/images/notesnap-mockup.png"
        alt="mockup image"
        width={1000}
        height={700}
        objectFit="contain"
        className=" rounded-lg"
      />
    </motion.section>
  );
};

export default Mockup;
