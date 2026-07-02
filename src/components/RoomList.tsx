const rooms = ["general", "tacos", "memes", "music"];

export default function RoomList({ currentRoom, onRoomChange }: { currentRoom: string; onRoomChange: (room: string) => void }) {
  return (
    <div className="p-4">
      <div className="uppercase text-xs text-gray-500 mb-4">Rooms</div>
      {rooms.map(room => (
        <button
          key={room}
          onClick={() => onRoomChange(room)}
          className={`w-full text-left px-4 py-3 mb-1 rounded-2xl capitalize ${currentRoom === room ? 'bg-green-600' : 'hover:bg-gray-800'}`}
        >
          #{room}
        </button>
      ))}
    </div>
  );
}
