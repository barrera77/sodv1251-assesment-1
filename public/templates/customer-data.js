const customersDataRow = (customer) => `
<tr>
    <td class="px-0">
        <div class="d-flex justify-content-center gap-3">
        <a href="/customer-details?id=${customer.id}" class="btn btn-view" data-link>
            <i class="bi bi-binoculars"></i>
        </a>
        <a href="/customers-crud?state=edit&id=${customer.id}" class="btn btn-edit" data-link >
            <i class="bi bi-pencil"></i>
        </a>
        <a href="/customers-crud?state=delete&id=${customer.id}"class="btn btn-delete" data-link >
            <i class="bi bi-trash"></i>
        </a>
        </div>
    </td>
    <td>${customer.name}</td>
    <td>${customer.address}</td>
    <td>${customer.city}</td>
    <td>${customer.email}</td>
    <td>${customer.phone}</td>
    <td>${customer.status}</td>
</tr>        
`;
export default customersDataRow;
