"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Title = ({
  title,
  description,
  button = null,
  href = "",
  visibleButton = true,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {title && <div className="mb-2">{title}</div>}

      {description && <div className="mb-2 text-center">{description}</div>}

      {button
        ? button
        : href &&
          visibleButton && (
            <Link
              href={href}
              className="flex items-center gap-1 text-green-500 mt-2 hover:underline"
            >
              Ver mais
              <ArrowRight size={14} />
            </Link>
          )}
    </div>
  );
};

export default Title;
