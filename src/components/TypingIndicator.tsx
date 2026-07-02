export default function TypingIndicator({ typingUsers }: { typingUsers: string[] }) {
  if (!typingUsers.length) return null;

  return (
    <div className="px-6 py-2 text-sm text-gray-400 flex items-center gap-2">
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300" />
      </div>
      <span>{typingUsers.slice(0, 2).join(", ")}{typingUsers.length > 2 ? " and others" : ""} typing...</span>
    </div>
  );
}
