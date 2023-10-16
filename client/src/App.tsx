import { useState } from "react";
import "./App.css";

function App() {
  const [value, setValue] = useState("");

  const handleClick = async () => {
    const response: any = await fetch("http://localhost:8000/stream-data", {
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    let done = false;
    while (!done) {
      const { value, done: isDone } = await reader.read();
      if (isDone) done = true;
      console.log("Received: ", value);
      setValue((prev) => prev + value);
    }
  };

  return (
    <main>
      <p>Streaming response:</p>
      <br />
      <div style={{ whiteSpace: "pre-wrap" }}>{value}</div>
      <button onClick={handleClick}>Submit</button>
    </main>
  );
}

export default App;
