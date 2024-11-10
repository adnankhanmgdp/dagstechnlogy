import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShippingPolicy = () => {
  const [answer, setAnswer] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");

  // console.log("cleaned",answer)

  const [showEditor, setShowEditor] = useState(false);

  const token = localStorage.getItem("token");

  const handleEditorChange = (content) => {
    const cleanedContent = content.trim().replace(/\s+/g, " ");
    setAnswer(cleanedContent);
  };

  const handleSubmit = async (e) => {
    setShowEditor(!showEditor);
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/additionaldetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingPolicy: answer
              .replace(/[\r\n]+/g, "||")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;"),
          }),
        },
      );
      const data = await res.json();
      setPrivacyPolicy(data.shippingPolicy.replace(/\|\|/g, "<br>"));
      toast.success("Shipping policy successfully updated");
    } catch (error) {
      toast.error("Failed to update Shipping policy");
    }
  };

  useEffect(() => {
    // Fetch the initial privacy policy content from the backend if needed
    const fetchPrivacyPolicy = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchMisc`, {
          method: "GET",
        });
        const data = await res.json();
        setPrivacyPolicy(data.charges.shippingPolicy.replace(/\|\|/g, "<br>"));
      } catch (error) {
        console.error("Failed to fetch privacy policy", error);
      }
    };
    fetchPrivacyPolicy();
  }, []);

  return (
    <div className="main-content" style={styles.mainContent}>
      <div className="page-content" style={styles.pageContent}>
        {showEditor ? (
          <div className="container-fluid" style={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <div>
                <Editor
                  apiKey="bl2idcdoodkvof939e208oh75c81zukd05yaztm1dx34yawo"
                  initialValue={privacyPolicy}
                  init={{
                    selector: "textarea",
                    skin: "bootstrap",
                    forced_root_block: false,
                    cleanup: true,
                    menu: {
                      file: {
                        title: "File",
                        items:
                          "newdocument restoredraft | preview | importword exportpdf exportword | print | deleteallconversations",
                      },
                      edit: {
                        title: "Edit",
                        items:
                          "undo redo | cut copy paste pastetext | selectall | searchreplace",
                      },
                      view: {
                        title: "View",
                        items:
                          "code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments",
                      },
                      insert: {
                        title: "Insert",
                        items:
                          "image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime",
                      },
                      format: {
                        title: "Format",
                        items:
                          "bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat",
                      },
                      tools: {
                        title: "Tools",
                        items:
                          "spellchecker spellcheckerlanguage | a11ycheck code wordcount",
                      },
                      table: {
                        title: "Table",
                        items:
                          "inserttable | cell row column | advtablesort | tableprops deletetable",
                      },
                      help: { title: "Help", items: "help" },
                    },
                    plugins: [
                      "advlist",
                      "autolink",
                      "link",
                      "image",
                      "lists",
                      "charmap",
                      "preview",
                      "anchor",
                      "pagebreak",
                      "searchreplace",
                      "wordcount",
                      "visualblocks",
                      "visualchars",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "emoticons",
                      "help",
                    ],
                    toolbar:
                      "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullscreen | forecolor backcolor emoticons | help",
                    menu: {
                      favs: {
                        title: "My Favorites",
                        items: "code visualaid | searchreplace | emoticons",
                      },
                    },
                    menubar:
                      "favs file edit view insert format tools table help",
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        ) : (
          <div style={styles.policyContainer}>
            <div
              style={styles.policyContent}
              dangerouslySetInnerHTML={{ __html: privacyPolicy }}
            ></div>
            <button
              className="w-25 border-0 bg-primary text-white p-1"
              onClick={() => setShowEditor(!showEditor)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  mainContent: {
    background: "#F8F8FB",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  pageContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  formContainer: {
    flex: "0 0 auto",
  },
  policyContainer: {
    flex: "1 1 auto",
    marginBottom: "65px",
    overflow: "auto",
    paddingLeft: "100px",
    paddingRight: "100px",
    paddingTop: "80px",
    paddingBottom: "80px",
    backgroundColor: "#F0F0F0",
  },
  policyHeader: {
    color: "#e4b666",
  },
  policyContent: {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    overflow: "auto",
  },
};

export default ShippingPolicy;
