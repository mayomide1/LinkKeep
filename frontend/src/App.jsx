import { useState, useEffect } from "react";
import axios from "axios";
import { IoMdAdd, IoMdArrowBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const App = () => {
  const url = import.meta.env.VITE_API_URL;

  const [labelName, setLabelName] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [linkName, setLinkName] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingLabelName, setEditingLabelName] = useState("");

  const [allLabels, setAllLabels] = useState([]);
  const [label, setLabel] = useState([]);

  const [isEditingLabel, setIsEditingLabel] = useState(false);

  const [openLabel, setOpenLabel] = useState(false);
  const [creating, setCreating] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);

  async function renderLabels() {
    try {
      const response = await axios.get(`${url}/labels`);
      setAllLabels(response.data);
      return response.data;
    } catch (err) {
      console.error(err.message);
    }
  }

  async function createLabel() {
    try {
      if (!labelName.trim()) {
        alert("Enter a custom label");
        return;
      }
      setCreating(true);
      const payload = { labelName };
      await axios.post(`${url}/label`, payload);
      alert("Label has been created successfully");
      await renderLabels();
    } catch (err) {
      console.error(err.message);
    } finally {
      setCreating(false);
      setLabelName("");
    }
  }

  async function deleteLabel(id) {
    try {
      if (!confirm("Are you sure you want to delete this label?")) {
        return;
      }
      await axios.delete(`${url}/label/${id}`);
      await renderLabels();
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleEditLabel(id) {
    try {
      const payload = {labelName}
      await axios.put(`${url}/label/${id}`, payload)
      alert("Label Name has been editted successfully")
      setLabelName("")
      await renderLabels()
    } catch (err) {
      console.error(err.message);
    }finally{
      setIsEditingLabel(false);
    }
  }

async function handleSaveURL(labelId) {
  try {
    try {
      new URL(linkURL);
    } catch {
      alert("Enter a valid URL");
      return;
    }

    let finalName = linkName.trim();
    if (!finalName) {
      try {
        finalName = new URL(linkURL).hostname;
      } catch {
        finalName = linkURL;
      }
    }

    const payload = { linkURL, linkName: finalName };
    setSavingUrl(true);
    await axios.put(`${url}/label/${labelId}/links`, payload);
    alert("The URL has been saved successfully");

    const labels = await renderLabels();
    const updated = labels?.find((l) => l._id === labelId);
    if (updated) setLabel(updated);

    setLinkURL("");
    setLinkName("");
  } catch (err) {
    console.error(err.message);
  } finally {
    setSavingUrl(false);
  }
}

  async function deleteLinkURL(labelId, linkId) {
    try {
      if (!confirm("Are you sure you want to delete this link?")) {
        return;
      }
      await axios.delete(`${url}/label/${labelId}/links/${linkId}`);
      alert("The URL has been deleted successfully");
      setLabel((prev) => ({
        ...prev,
        links: prev.links.filter((l) => l._id !== linkId),
      }));
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    renderLabels();
  }, []);

  return (
    <>
      <div className="app">
        {!openLabel && (
          <>
            <header className="page-header">
              <h1 className="page-title">Your labels</h1>
              <p className="page-subtitle">
                Group the links you want to come back to.
              </p>
            </header>

            <div className="create-bar">
              <input
                className="input"
                type="text"
                placeholder="Enter a custom label (e.g., Cooking Inspiration)"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
              />
              <button
                className="btn btn-primary"
                disabled={creating}
                onClick={() => {
                  {isEditingLabel ? handleEditLabel(editingId) : createLabel();}
                }}
              >
                {creating ? (
                  <>{isEditingLabel ? "Editing" : "Creating"}Label</>
                ) : (
                  <>
                    {" "}
                  {isEditingLabel ? "Edit" : <> <IoMdAdd /> Create</>} Label
                  </>
                )}
              </button>
            </div>

            <div className="label-list">
              {allLabels.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-text">
                    No activity yet. Create a new label to get started.
                  </p>
                </div>
              ) : (
                allLabels.map((label) => {
                  return (
                    <div
                      key={label._id}
                      className="label-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setOpenLabel(true);
                        setLabel(label)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setOpenLabel(true);
                          setLabel(label);
                        }
                      }}
                    >
                      <div className="label-info">
                        <h2 className="label-name">{label.labelName}</h2>
                        <p className="label-count">
                          You have{" "}
                          <span className="label-count-number">
                            {label.links.length}
                          </span>{" "}
                          {label.links.length > 1 ? "links" : "link"} here
                        </p>
                        <p className="meta">{label.date}</p>
                      </div>
                      <div className="label-actions">
                        <button
                          className="btn btn-ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingId(label._id)
                            setLabelName(label.labelName)
                            setIsEditingLabel(true)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLabel(label._id);
                          }}
                        >
                          <MdDelete /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {openLabel && (
          <>
            <header className="detail-header">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setOpenLabel(false);
                }}
              >
                <IoMdArrowBack /> Back
              </button>
              <h2 className="page-title">{label.labelName}</h2>
            </header>

            <div className="link-form">
              <div className="field">
                <label className="field-label">URL</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Enter a URL to save"
                  value={linkURL}
                  onChange={(e) => setLinkURL(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field-label">Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Enter a name for the url"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary"
                disabled={savingUrl}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveURL(label._id);
                }}
              >
                {savingUrl ? "Saving URL.." : "Save URL"}
              </button>
            </div>

            <div className="link-list">
              {label.links.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-text">
                    No Link saved yet. When you save a link, it will show here.
                  </p>
                </div>
              ) : (
                label.links.map((link) => {
                  return (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div key={link._id} className="link-item">
                        <div className="link-info">
                          <a
                            className="link-anchor"
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.linkName}
                          </a>
                          <p className="meta">{link.date}</p>
                        </div>
                        <div className="link-actions">
                          <button className="btn btn-ghost">Edit</button>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteLinkURL(label._id, link._id);
                            }}
                          >
                            <MdDelete /> Delete
                          </button>
                        </div>
                      </div>
                    </a>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default App;
