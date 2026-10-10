import { useState } from "react"

const App = () => {
  const [name, setName] = useState("")
  const [link, setLink] = useState("")
  const [openModal, setOpenModal] = useState(false)

  async function handleAddMovieName(){

  }

  async function handleAddMovieLink(){

  }
  return (
    <>
    {!openModal && (
    <>
    <div>
      <input type="text" placeholder="Enter Movie Name" value={name} onChange={(e) => setName(e.target.value)}/>
      <button onClick={() => handleAddMovieName()}>Add Name</button>
    </div>
    </>
  )}

    {openModal && (
      <>
      <div>
        <input type="text" placeholder="Enter link" value={link} onChange={(e) => setLink(e.target.value)}/>
        <button onClick={() => handleAddMovieLink()}>Add Link</button>
      </div>
      </>
    )}
    </>
  )
}

export default App

