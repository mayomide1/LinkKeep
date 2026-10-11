import { useState, useEffect } from "react";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";

const App = () => {
  const url = import.meta.env.VITE_API_URL;

  const [labelName, setLabelName] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [linkName, setLinkName] = useState("");

  const [allLabels, setAllLabels] = useState([]);
  const [label, setLabel] = useState([]);

  const [openLabel, setOpenLabel] = useState(false);
  const [creating, setCreating] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);

  async function renderLabels() {
    try {
      const response = await axios.get(`${url}/labels`);
      setAllLabels(response.data);
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
      setLabelName("");
      await renderLabels();
    } catch (err) {
      console.error(err.message);
    } finally {
      setCreating(false);
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

  async function handleSaveURL(labelId) {
    try {
    if(!linkURL.includes("http")){
      alert("Enter a valid URL (must start with http:// or https://)");
      return
    }

    // Use the typed name, or fall back to the domain
    let finalName = linkName.trim();

    if (!finalName) {
      try {
        const link = new URL(linkURL);
        finalName = link.hostname;   // e.g. "github.com"
      } catch {
        finalName = linkURL;         // fallback if URL parsing fails
      }
    }

      const payload = { linkURL, linkName: finalName  };
      setSavingUrl(true);
      await axios.put(`${url}/label/${labelId}/links`, payload);
      alert("The URL has been saved successfully");
      await renderLabels();
    } catch (err) {
      console.error(err.message);
    } finally {
      setSavingUrl(false);
    }
  }

  async function deleteLinkURL(labelId, linkId) {
    try {
      await axios.delete(`${url}/label/${labelId}/links/${linkId}`);
      alert("The URL has been deleted successfully");
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
        <p className="page-subtitle">Group the links you want to come back to.</p>
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
            createLabel();
          }}
        >
          {creating ? "Creating Label" : "Create Label"}
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
                  setLabel(label);
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
                    className="btn btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLabel(label._id);
                    }}
                  >
                    Delete
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
          Back
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
                      e.stopPropagation();
                      deleteLinkURL(label._id, link._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
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
