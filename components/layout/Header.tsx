"use client";
import * as React from "react";
import { Bell } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export const Header: React.FC = () => {
  const { userName } = useAppStore();
  const t = useTranslations('common');

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-gray-900 leading-tight">
          {userName ? `${t('hi')}, ${userName}` : "Civic AI"}
        </h1>
        <p className="text-xs text-gray-500 font-medium">{t('election_year')}</p>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button className="p-2.5 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
};
