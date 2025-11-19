// ====================================
// Account Switcher JavaScript
// ====================================

// Load account switcher modal
async function loadAccountSwitcher() {
  try {
    // Get available accounts
    const result = await getAvailableAccounts();
    const accounts = result.accounts || [];
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'accountSwitcherModal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.2s ease;
      overflow-y: auto;
      padding-top: 5vh;
      padding-bottom: 5vh;
    `;
    
    modal.innerHTML = `
      <div style="
        background: var(--card, #ffffff);
        border-radius: 12px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2 style="margin: 0; color: var(--primary); font-size: 1.5rem;">Switch Account</h2>
          <button onclick="closeAccountSwitcher()" style="
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--muted-foreground);
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            line-height: 1;
          ">&times;</button>
        </div>
        
        <div id="accountsList" style="margin-bottom: 1.5rem;">
          ${accounts.length === 0 ? '<p style="color: var(--muted-foreground); text-align: center; padding: 2rem;">No other accounts available</p>' : ''}
          ${accounts.map(account => {
            const initials = account.name ? account.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
            const isCurrent = account.isCurrent ? true : false;
            return `
              <div class="account-item" data-account-id="${account.id}" style="
                display: flex;
                align-items: center;
                padding: 1rem;
                margin-bottom: 0.75rem;
                border: 2px solid ${isCurrent ? 'var(--primary)' : 'var(--border)'};
                border-radius: 8px;
                background: ${isCurrent ? 'var(--muted)' : 'var(--card)'};
                cursor: ${isCurrent ? 'default' : 'pointer'};
                transition: all 0.2s;
                opacity: ${isCurrent ? '0.7' : '1'};
              " onmouseover="${!isCurrent ? "this.style.borderColor='var(--primary)'; this.style.transform='translateX(4px)'" : ''}" 
                 onmouseout="${!isCurrent ? "this.style.borderColor='var(--border)'; this.style.transform='translateX(0)'" : ''}"
                 onclick="${!isCurrent ? `switchToAccount('${account.id}')` : ''}">
                <div style="
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, var(--primary) 0%, #2c3e50 100%);
                  color: white;
                  font-weight: 600;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 1rem;
                  flex-shrink: 0;
                ">${initials}</div>
                <div style="flex: 1;">
                  <div style="font-weight: 600; color: var(--foreground); margin-bottom: 0.25rem;">
                    ${account.name}
                    ${isCurrent ? '<span style="font-size: 0.75rem; color: var(--primary); margin-left: 0.5rem;">(Current)</span>' : ''}
                  </div>
                  <div style="font-size: 0.85rem; color: var(--muted-foreground);">
                    ${account.email}
                  </div>
                  ${account.role === 'admin' ? '<div style="font-size: 0.75rem; color: #10b981; margin-top: 0.25rem; font-weight: 500;">⚙️ Admin</div>' : ''}
                </div>
                ${!isCurrent ? '<span style="color: var(--muted-foreground); font-size: 1.25rem;">→</span>' : ''}
              </div>
            `;
          }).join('')}
        </div>
        
        <div style="border-top: 1px solid var(--border); padding-top: 1rem;">
          <button onclick="closeAccountSwitcher()" class="btn btn-outline" style="width: 100%; padding: 0.75rem;">
            Cancel
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Ensure modal appears at top of viewport
    modal.scrollTop = 0;
    
    // Scroll the modal container to show content at top
    requestAnimationFrame(() => {
      modal.scrollTop = 0;
      // Focus on the modal content to ensure it's visible
      const modalContent = modal.querySelector('div');
      if (modalContent) {
        modalContent.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });
    
    // Close on background click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeAccountSwitcher();
      }
    });
    
  } catch (error) {
    console.error('Failed to load account switcher:', error);
    alert('Failed to load accounts. Please try again.');
  }
}

// Show account switcher modal
function showAccountSwitcher() {
  // Close dropdown if open
  const dropdown = document.getElementById('userDropdownMenu');
  if (dropdown) dropdown.style.display = 'none';
  
  // Load and show account switcher
  loadAccountSwitcher();
}

// Close account switcher
function closeAccountSwitcher() {
  const modal = document.getElementById('accountSwitcherModal');
  if (modal) {
    modal.style.animation = 'fadeOut 0.2s ease';
    setTimeout(() => modal.remove(), 200);
  }
}

// Switch to another account
async function switchToAccount(accountId) {
  try {
    const result = await switchAccount(accountId);
    if (result.success) {
      closeAccountSwitcher();
      // Reload page to reflect new user session
      window.location.reload();
    } else {
      alert(result.message || 'Failed to switch account');
    }
  } catch (error) {
    console.error('Account switch error:', error);
    alert(error.message || 'Failed to switch account');
  }
}

// Add CSS animations
if (!document.getElementById('accountSwitcherStyles')) {
  const style = document.createElement('style');
  style.id = 'accountSwitcherStyles';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

// Make functions globally available
window.loadAccountSwitcher = loadAccountSwitcher;
window.closeAccountSwitcher = closeAccountSwitcher;
window.switchToAccount = switchToAccount;
window.showAccountSwitcher = showAccountSwitcher;
