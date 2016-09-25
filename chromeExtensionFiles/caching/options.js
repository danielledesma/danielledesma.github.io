// Save this script as `options.js`

        // Saves options to localStorage.
        function save_options() {
          var checkbox = document.getElementById("muted");
          localStorage["muted"] = checkbox.checked;

          // Update status to let user know options were saved.
          var status = document.getElementById("status");
          status.innerHTML = "Options Saved.";
          setTimeout(function() {
            status.innerHTML = "";
          }, 750);
        }

        // Restores select box state to saved value from localStorage.
        function restore_options() {
          var muted = localStorage["muted"];
          if (!muted) {
            return;
          }
          var checkbox = document.getElementById("muted");
          checkbox.checked = muted;
        }
        document.addEventListener('DOMContentLoaded', restore_options);
        document.querySelector('#save').addEventListener('click', save_options);