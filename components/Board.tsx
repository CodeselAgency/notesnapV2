import { useBoard } from "@/hooks/useBoard";
import { useEffect } from "react";

export function Board() {
  const { createBoard, loadBoards, loading, error, boards } = useBoard();

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const boardHandler = () => {
    createBoard("New Board", "New Description", "red");
  };

  return (
    <div>
      <h1>Board</h1>
      <button onClick={() => boardHandler()}>Create New Board</button>
      <div>
        {boards.map((board) => (
          <div key={board.id}>{board.name}</div>
        ))}
      </div>
    </div>
  );
}
