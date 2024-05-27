import { useState, useEffect } from "react";
import "./App.css";
import { db } from "../firebase";
import { addDoc, collection, getDocs, doc, updateDoc } from "firebase/firestore";

function App() {
  const [response, setResponse] = useState("");
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    const getCollectionData = async () => {
      const snapshot = await getDocs(collection(db, "responses"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        response: doc.data().response,
        votes: doc.data().votes,
      }));
      data.sort((a,b) => b.votes - a.votes);
      setResponseData(data);
    };

    getCollectionData();
  }, []);

  const handleVote = async (docID, currentVotes) => {
    const responseDoc = doc(db, "responses", docID);
    await updateDoc(responseDoc, { votes: currentVotes + 1 });
    const data = responseData.map((response) =>
      response.id === docID ? { ...response, votes: response.votes + 1 } : response
    )
    data.sort((a,b) => b.votes - a.votes);
    setResponseData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "responses"), {
        response: response,
        votes: 1,
      });
      const data = [...responseData, { id: docRef.id, response: response, votes: 1 }]
      data.sort((a,b) => b.votes - a.votes);
      setResponseData(data);
      setResponse("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <h1>Q: What is your favorite pet animal?</h1>
      <div>
        {responseData.map((response) => (
          <div key={response.id}>
            <span>{response.response} - Votes: {response.votes}</span>
            <button onClick={() => handleVote(response.id, response.votes)}>+1 Vote</button>
          </div>
        ))}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <label>New response: </label>
          <input
            type="text"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;
