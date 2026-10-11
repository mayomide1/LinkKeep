import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"

const App = () => {
  const url = import.meta.env.VITE_API_URL

  const [labelName, setLabelName] = useState("")
  const [allLabels, setAllLabels] = useState([])
  const [linkURL, setLinkURL] = useState("")
  const [linkName, setLinkName] = useState("")
  const [label, setLabel] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

async function renderLabels(){
  try{
    const response = await axios.get(`${url}/labels`)
    console.log(response.data)
    setAllLabels(response.data)
  }catch(err){
    console.error(err.message)
  }
}

  async function createLabel(){
    try{

      if(!labelName.trim()){
        alert("Enter a custom label")
        return
      }
      setSubmitting(true)
      const payload = {labelName}
      const response = await axios.post(`${url}/label`, payload)
      console.log(response.data)
      alert("Label has been created successfully")
      setLabelName("")
      renderLabels()
    }catch(err){
      console.error(err.message)
    }finally{
      setSubmitting(false)
    }
  }

async function deleteLabel(id){
  try{
    if(!confirm("Are you sure you want to delete this label?")){
      return
    }

    await axios.delete(`${url}/label/${id}`)
    renderLabels()
  }catch(err){
    console.error(err.message)
  }
}

async function renderURL(labelId){
    try{
    const response = await axios.get(`${url}/label/${labelId}/links`)
    console.log(response.data)
  }catch(err){
    console.error(err.message)
  }
}

  async function handleSaveURL(labelId){
    try{
      const payload = {linkURL, linkName}
      setSubmitting(true)
      const response = await axios.put(`${url}/label/${labelId}/links`, payload)
      console.log(response.data)
      alert("The URL has been added successfully")
      renderURL(labelId)
    }catch(err){
      console.error(err.message)
    }finally{
      setSubmitting(false)
    }
  }


useEffect(() => {
  renderLabels()
}, [])

  return (
    <>
    {!openModal && (
    <>
    <div>
      <input type="text" placeholder="Enter a custom label (e.g., Cooking Inspiration)" value={labelName} onChange={(e) => setLabelName(e.target.value)}/>
      <button onClick={() => {createLabel();}}>{submitting ? "Creating Label" : "Create Label"}</button>
    </div>
      <div>
        {allLabels.length === 0 ? <><p>No activity yet. Create a new label to get started.</p></> : allLabels.map(label => {
          return(
          <div key={label._id} onClick={() => {setOpenModal(true); setLabel(label)}}>
            <div>
            <h2>{label.labelName}</h2>
            <p>You have {label.links.length} {label.links.length > 1 ? "links" : "link"} here</p>
            <p>{label.date}</p>
            </div>
            <div>
              <button onClick={(e) => {e.stopPropagation(); deleteLabel(label._id); renderURL(label._id) }}>Delete</button>
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

        <button onClick={() => {handleSaveURL(label._id);}}>{submitting ? "saving.." : "Save URL"}</button>
      </div>

      {label.links.length === 0 ? <><p>No Link saved yet. When you save a link, it will show here.</p></> : label.links.map(link => {
        return(
          <div key={link._id}>
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

