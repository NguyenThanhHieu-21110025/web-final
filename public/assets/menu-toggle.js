// Toggle dropdown menu khi nhấp vào hamburger
function toggleDropdownMenu() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.classList.toggle('active');
    } else {
        console.error("Không tìm thấy phần tử có ID 'dropdown-menu'");
    }
}

// Toggle menu người dùng khi nhấp vào icon người dùng
function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.classList.toggle('active');
    } else {
        console.error("Không tìm thấy phần tử có ID 'user-menu'");
    }
}
