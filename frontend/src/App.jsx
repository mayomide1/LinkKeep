import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"

const App = () => {
  const url = import.meta.env.VITE_API_URL

  const [labelName, setLabelName] = useState("")
  const [labels, setLabels] = useState([])
  const [linkURL, setLinkURL] = useState("")
  const [linkName, setLinkName] = useState("")
  const [links, setLinks] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

async function renderLabels(){
  try{
    const response = await axios.get(`${url}/upload/label`)
    console.log(response.data)
    setLabels(response.data)
  }catch(err){
    console.error(err.message)
  }
}

useEffect(() => {
  renderLabels()
}, [])

  async function createLabel(){
    try{
      if(!labelName.trim()){
        alert("Enter a cutom label")
        return
      }
      setSubmitting(true)
      const payload = {labelName}
      const response = await axios.post(`${url}/upload/label`, payload)
      console.log(response.data)
      setMessage("Label Created Successfully")
      setLabelName("")
    }catch(err){
      console.error(err.message)
    }finally{
      setSubmitting(false)
    }
  }

  async function handleAddLinkURL(){

  }
  return (
    <>
    {!openModal && (
    <>
    <div>
      <h2>{message}</h2>
      <input type="text" placeholder="Enter a custom label (e.g., Cooking Inspiration)" value={labelName} onChange={(e) => setLabelName(e.target.value)}/>
      <button onClick={() => {createLabel();}}>{submitting ? "Creating Label" : "Create Label"}</button>
    </div>
      <div>
        {labels.length === 0 ? <><p>No activity yet. Create a new label to get started.</p></> : labels.map(label => {
          return(
          <div key={label._id} onClick={() => {setOpenModal(true); setLinks(label.links)}}>
            <div>
            <h2>{label.name}</h2>
            <p>You have {label.links.length} {label.links.length > 1 ? "links" : "link"} here</p>
            <p>{label.date}</p>
            </div>
            <div>
              <button onClick={(e) => {e.stopPropagation(); }}>Delete</button>
            </div>
            </div>
          )
        })}
      </div>
    </>
  )}

    {openModal && (
      <>
      <div>
        <button onClick={() => {setOpenModal(!openModal)}}>Back</button>
        <input type="text" placeholder="Enter a URL to save" value={linkURL} onChange={(e) => setLinkURL(e.target.value)}/>
        <input type="text" placeholder="Enter a name for the url (Optional)" value={linkName} onChange={(e) => setLinkName(e.target.value)}/>

        <button onClick={() => {handleAddLinkURL(labels._id);}}>Save URL</button>
      </div>

      {links.length === 0 ? <><p>No Link saved yet. When you save a link, it will show here.</p></> : links.map(link => {
        return(
          <div>
          <div>
            <p>{link.linkName}</p>
            <p>{link.url}</p>
            <p>{link.date}</p>
          </div>
          <div>
            <button>Edit</button>
            <button>Delete</button>
          </div>
          </div>
        )
      })}
      </>
    )}
    </>
  )
}

export default App

