
let data = [];

let currentPage = 1;
const pageSize = 10;
let selectedRows = [];

async function fetchData() {
    try {
        const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
        const result = await response.json();
        
        data = result || [];
        renderTable();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderTable() {
    renderTableData();
    updatePagination();
}

function renderTableData() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const rowsToDisplay = data.slice(startIndex, endIndex);

    rowsToDisplay.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" onclick="selectRow(${row.id})"></td>
            <td>${row.id}</td>
            <td>${row.name}</td>
            <td>${row.email}</td>
            <td>${row.role}</td>
            <td>
                <button class="edit" onclick='editRow(${row.id})'>Edit</button>
                <button class="delete" onclick='deleteRow(${row.id})'>Delete</button>
            </td>
        `;
        tr.addEventListener('click', () => toggleRowSelection(tr, row.id));
        tableBody.appendChild(tr);
    });
}

function toggleRowSelection(rowElement, id) {
    rowElement.classList.toggle('selected');

    const selectedRow = data.find(row => row.id === id);
    if (selectedRow) {
        selectedRow.selected = !selectedRow.selected;
    }
}

function searchOnEnter(event) {
    if (event.key === 'Enter') {
        search();
    }
}

function updatePagination() {
    const totalPages = Math.ceil(data.length / pageSize);
    document.getElementById('currentPage').innerText = `Page ${currentPage} of ${totalPages}`;
}

function gotoPage(page) {
    currentPage = page;
    renderTable();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(data.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function gotoLastPage() {
    const totalPages = Math.ceil(data.length / pageSize);
    currentPage = totalPages;
    renderTable();
}

function search() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    const filteredData = data.filter(row =>
        Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm))
    );

    currentPage = 1;
    data.length = 0;
    data.push(...filteredData);
    renderTable();
}

function selectRow(rowId) {
    const index = selectedRows.indexOf(rowId);
    if (index === -1) {
        selectedRows.push(rowId);
    } else {
        selectedRows.splice(index, 1);
    }

    renderTable();
}

function selectAll() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const checkboxes = document.querySelectorAll('#tableBody input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
        toggleRowSelection(checkbox.id); 
    });
}

function deleteRow(rowId) {
    console.log(`Deleting row with ID ${rowId}`);
    data.splice(data.findIndex(row => row.id === rowId), 1);
    renderTable();
}

function deleteSelected() {
    data = data.filter(row => !row.selected);
    renderTable();
}

function editRow(rowId) {
    console.log(`Editing row with ID ${rowId}`);
}

fetchData();
