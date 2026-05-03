import { ChatInterface } from "@/features/ai-assistant/ChatInterface";
import { Suspense } from "react";

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full p-10"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" /></div>}>
      <ChatInterface />
    </Suspense>
  );
}
