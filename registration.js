const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxAzJi7L_Lg4ifAgRa4CzQdgMjUhyMfFjmTtDNhoTq8SOxSQmn-bRqUzl95eknm7gwY/exec";
 // Set Race Target Date

    const raceDate = new Date("December 12, 2026 00:00:00").getTime();
    
    setInterval(() => {
      const now = new Date().getTime();
      const diff = raceDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById('countdown').textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else {
        document.getElementById('countdown').textContent = "RACE DAY IS HERE!";
      }
    }, 1000);

    function togglePaymentDetails(type) {
      document.getElementById('gcashDetails').classList.toggle('hidden', type !== 'gcash');
      document.getElementById('bankDetails').classList.toggle('hidden', type !== 'bank');
    }

    function openFullscreen(imageSrc) {
      const modal = document.getElementById('fullscreenModal');
      const img = document.getElementById('fullscreenImg');
      img.src = imageSrc;
      modal.classList.remove('hidden');
    }

    function closeFullscreen() {
      document.getElementById('fullscreenModal').classList.add('hidden');
    }

    function fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          base64: reader.result.split(',')[1],
          type: file.type,
          name: file.name
        });
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }

    document.getElementById('registrationForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const fileInput = document.getElementById('receiptFile');
      if (fileInput.files.length > 0 && fileInput.files[0].size > 5 * 1024 * 1024) {
        showModal('error', "File Size Error", "Selected image is larger than 5MB. Please upload a smaller file or screenshot.");
        return;
      }

      setLoading(true);

      try {
        let receiptData = null;
        if (fileInput.files.length > 0) {
          receiptData = await fileToBase64(fileInput.files[0]);
        }

        const payload = {
          fullName: document.getElementById('fullName').value.trim(),
          nickname: document.getElementById('nickname').value.trim(),
          email: document.getElementById('email').value.trim(),
          phone: document.getElementById('phone').value.trim(),
          club: document.getElementById('club').value.trim(),
          shirtSize: document.getElementById('shirtSize').value,
          emergencyName: document.getElementById('emergencyName').value.trim(),
          emergencyPhone: document.getElementById('emergencyPhone').value.trim(),
          category: document.querySelector('input[name="category"]:checked').value,
          paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
          receipt: receiptData
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success') {
          document.getElementById('registrationForm').reset();
          document.getElementById('gcashDetails').classList.add('hidden');
          document.getElementById('bankDetails').classList.add('hidden');
          
          showModal('success', "REGISTRATION RECEIVED!", "We have received your registration details and payment receipt. Your official bib number will be emailed once payment verification is completed.");
        } else {
          throw new Error(result.message || "Unable to save your registration to the database.");
        }
      } catch (err) {
        showModal('error', "Submission Failed", err.message || "A network or server error occurred. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    });

    function showModal(type, title, description) {
      const modal = document.getElementById('statusModal');
      const iconContainer = document.getElementById('modalIconContainer');
      const icon = document.getElementById('modalIcon');
      const titleEl = document.getElementById('modalTitle');
      const descEl = document.getElementById('modalDesc');
      const bibBox = document.getElementById('modalBibBox');
      const qrContainer = document.getElementById('modalQRContainer');

      titleEl.textContent = title;
      descEl.textContent = description;

      if (type === 'success') {
        iconContainer.className = "w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-xl font-bold";
        icon.textContent = "✓";
        bibBox.style.display = 'block';
        document.getElementById('modalBib').textContent = "PENDING";
        qrContainer.classList.add('hidden');
      } else {
        iconContainer.className = "w-12 h-12 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-xl font-bold";
        icon.textContent = "✕";
        bibBox.style.display = 'none'; 
        qrContainer.classList.add('hidden');
      }

      modal.classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('statusModal').classList.add('hidden');
      //redirect to index
    }

    function setLoading(isLoading) {
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = isLoading;
      document.getElementById('btnText').textContent = isLoading ? "Submitting..." : "Submit Registration";
      document.getElementById('loadingSpinner').classList.toggle('hidden', !isLoading);
    }