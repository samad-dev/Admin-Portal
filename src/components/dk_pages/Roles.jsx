import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import ProductH from "../../images/product/h.png";
import Dropzone from "react-dropzone";
import SimpleBar from "simplebar-react";
import {
    Block,
    BlockHead,
    BlockTitle,
    BlockBetween,
    BlockHeadContent,
    BlockDes,
    Icon,
    Row,
    Col,
    Button,
    DataTableHead,
    DataTableBody,
    DataTableRow,
    DataTableItem,
    PaginationComponent,
} from "../Component";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Badge } from "reactstrap";
import { productData, categoryOptions } from "./ProductData";
import { useForm } from "react-hook-form";
import { Modal, ModalBody } from "reactstrap";
import { RSelect } from "../Component";
import { Spinner } from "reactstrap";
const data_check = [
    {
        value: "1",
        label: "View",

    },
    {
        value: "2",
        label: "Create",
    },
    {
        value: "3",
        label: "Edit",
    },
    {
        value: "4",
        label: "Delete",
    }
];

const UsersList = () => {
    const [data, setData] = useState([]);
    const [cabinets, setCabinetData] = useState([]);
    const [roles, setRolesData] = useState([]);

    const [sm, updateSm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        role: [],
        sku: [],
        category: [],
        folders: [],
        alc: [],
        custom_fields: [],
        role: [],
        users: [],


    });
    const [editId, setEditedId] = useState();
    const [view, setView] = useState({
        edit: false,
        add: false,
        details: false,
    });
    const [onSearchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(7);
    const [files, setFiles] = useState([]);
    var rights;


    const fetchAllUsersData = () => {
        fetch("/roles", {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                return response.json();
            }).then((datas) => {
                let rows = datas;
                // console.log(rows[0]['acl_tab']);
                var acl_tab = rows[0]['acl_tab'];
                acl_tab = acl_tab.replaceAll("'", '"');
                // console.log("Samad "+acl_tab);
                setData(rows);
            })
    };
    // Changing state value when searching name
    useEffect(() => {
        if (onSearchText !== "") {
            const filteredObject = data.filter((item) => {
                // return item.username.toLowerCase().includes(onSearchText.toLowerCase());
                var id = toString(item.id);
                
                if (item.id===parseInt(onSearchText)){
                    console.log("search "+onSearchText);
                    return true;
                }
               else if (item.privilege.toLowerCase().includes(onSearchText.toLowerCase())) {
                console.log(item.privilege.toLowerCase().includes(onSearchText.toLowerCase()));
                    return item.privilege.toLowerCase().includes(onSearchText.toLowerCase());
                }
                else if (item.create_at.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.create_at.toLowerCase().includes(onSearchText.toLowerCase());
                }
            });
            console.log(filteredObject);
            setData([...filteredObject]);
        } else {
            rights= localStorage.getItem("roles");
            // console.log(localStorage.getItem("roles"));
            rights = rights.replaceAll("'", '"');
            // console.log("Samad "+rights);
            const obj = JSON.parse(rights);
            // console.log(obj.create + ", " + obj.update);
            fetchAllUsersData();

        }
    }, [onSearchText]);

    // OnChange function to get the input data
    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // category change
    const onCategoryChange = (value) => {
        setFormData({ ...formData, role: value });
    };
    const onCategoryskuChange = (value) => {
        setFormData({ ...formData, sku: value });
    };
    const onFolderChange = (value) => {
        setFormData({ ...formData, folders: value });
    };
    const onAClChange = (value) => {
        setFormData({ ...formData, alc: value });
    };

    const onCustomChange = (value) => {
        setFormData({ ...formData, custom_fields: value });
    };
    const onRoleChange = (value) => {
        setFormData({ ...formData, role: value });
    };
    const onUsersChange = (value) => {
        setFormData({ ...formData, users: value });
    };

    // function to close the form modal
    const onFormCancel = () => {
        setView({ edit: false, add: false, details: false });
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: [],
            sku: [],
            category: [],
            folders: [],
            alc: [],
            custom_fields: [],
            role: [],
            users: [],


        });
        reset({});
    };

    const onFormSubmit = (form) => {
        const { title, price, sku, stock, role, salePrice } = form;
        let submittedData = {
            id: data.length + 1,
            name: title,
            email: price,
            password: salePrice,
            role: formData.role,
            cabinet: formData.sku,
        };

        let orgs = formData.role;
        let cabinets = formData.sku;
        let folders = formData.folders;
        let acl = formData.alc;
        let custom_fields = formData.custom_fields;
        let role_fields = formData.role;
        let user_role = formData.users;

        // console.log(title);
        var orgs_object = check_role(orgs);
        // console.log("orgs ");
        // console.log(orgs_object);
        var cabinets_object = check_role(cabinets);
        // console.log("cabinets ");
        // console.log(cabinets_object);

        var Folder_object = check_role(folders);
        // console.log("Folders ");
        // console.log(Folder_object);

        var alc_object = check_role(acl);
        // console.log("Acl ");
        // console.log(alc_object);

        var custom_fields_object = check_role(custom_fields);
        // console.log("custom fields ");
        // console.log(custom_fields_object);

        var role_object = check_role(role_fields);
        // console.log("Roles ");
        // console.log(role_object);

        var users_object = check_role(user_role);
        // console.log("Users ");
        // console.log(users_object);


        function check_role(value) {
            let view = "0", create = "0", updates = "0", deletes = "0";

            for (var i = 0; i < value.length; i++) {
                if (value[i].label == 'Create') {
                    create = "1";

                }
                if (value[i].label == 'View') {
                    view = "1";

                }
                if (value[i].label == 'Edit') {
                    updates = "1";

                }
                if (value[i].label == 'Delete') {
                    deletes = "1";

                }

            }

            let org_obj = "{'create':'" + create + "','update':'" + updates + "','deleted':'" + deletes + "','view':'" + view + "'}";

            return org_obj;

        }


        if (title != "") {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var today = new Date();
            let inserted = {
                "privilege": title,
                "cabinet_tab": cabinets_object,
                "folder_tab": Folder_object,
                "acl_tab": alc_object,
                "custom_tab": custom_fields_object,
                "user_tab": users_object,
                "roles": role_object,
                "create_at": today,
                "create_by": '1'
            };
            console.log(inserted);
            var raw = JSON.stringify(inserted);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("/roles", requestOptions)
                .then(response => response.text())
                .then((result) => {
                    console.log(result);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'New Rocord Created.',
                        showConfirmButton: false,
                        timer: 1500
                      })
                    fetchAllUsersData();
                })
                .catch(error => console.log('error', error));
        }




        // // setData([submittedData, ...data]);
        setView({ open: false });
        setFiles([]);
        resetForm();
    };

    const onEditSubmit = () => {
        let submittedData;
        let newItems = data;
        let index = newItems.findIndex((item) => item.id === editId);

        newItems.forEach((item) => {
            if (item.id === editId) {
                submittedData = {
                    id: editId,
                    name: formData.name,
                    img: files.length > 0 ? files[0].preview : item.img,
                    sku: formData.sku,
                    price: formData.price,
                    stock: formData.stock,
                    category: formData.category,
                    fav: false,
                    check: false,
                };
            }
        });
        newItems[index] = submittedData;
        //setData(newItems);
        resetForm();
        setView({ edit: false, add: false });
    };

    // function that loads the want to editted data
    const onEditClick = (id) => {
        data.forEach((item) => {
            if (item.id === id) {
                setFormData({
                    name: item.name,
                    img: item.img,
                    sku: item.sku,
                    price: item.price,
                    stock: item.stock,
                    category: item.category,
                    fav: false,
                    check: false,
                });
            }
        });
        setEditedId(id);
        setFiles([]);
        setView({ add: false, edit: true });
    };

    // selects all the Roles
    const selectorCheck = (e) => {
        let newData;
        newData = data.map((item) => {
            item.check = e.currentTarget.checked;
            return item;
        });
        setData([...newData]);
    };

    // selects one product
    const onSelectChange = (e, id) => {
        let newData = data;
        let index = newData.findIndex((item) => item.id === id);
        newData[index].check = e.currentTarget.checked;
        setData([...newData]);
    };

    // onChange function for searching name
    const onFilterChange = (e) => {
        setSearchText(e.target.value);
    };

    // function to delete a product
    const deleteProduct = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {

                var requestOptions = {
                    method: 'DELETE',
                    redirect: 'follow'
                };

                fetch("/roles/" + id + "", requestOptions)
                    .then(response => response.text())
                    .then((result) => {
                        Swal.fire("Deleted!", "Your file has been deleted.", "success");
                        console.log(result);
                        fetchAllUsersData();
                    })
                    .catch(error => Swal.fire("Error!", error, "Failed"));

            }
        });
    };

    // function to delete the seletected item
    const selectorDeleteProduct = () => {
        let newData;
        newData = data.filter((item) => item.check !== true);
        setData([...newData]);
    };

    // toggle function to view product details
    const toggle = (type) => {
        setView({
            edit: type === "edit" ? true : false,
            add: type === "add" ? true : false,
            details: type === "details" ? true : false,
        });
    };

    // handles ondrop function of dropzone
    const handleDropChange = (acceptedFiles) => {
        setFiles(
            acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            )
        );
    };

    // Get current list, pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const { errors, register, handleSubmit, reset } = useForm();

    return (
        <React.Fragment>
            <Head title="Product List"></Head>
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle>Roles</BlockTitle>
                        </BlockHeadContent>
                        <BlockHeadContent>
                            <div className="toggle-wrap nk-block-tools-toggle">
                                <a
                                    href="#more"
                                    className="btn btn-icon btn-trigger toggle-expand mr-n1"
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        updateSm(!sm);
                                    }}
                                >
                                    <Icon name="more-v"></Icon>
                                </a>
                                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                                    <ul className="nk-block-tools g-3">
                                        <li>
                                            <div className="form-control-wrap">
                                                <div className="form-icon form-icon-right">
                                                    <Icon name="search"></Icon>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="default-04"
                                                    placeholder="Quick search by Role Name"
                                                    onChange={(e) => onFilterChange(e)}
                                                />
                                            </div>
                                        </li>

                                        <li className="nk-block-tools-opt">
                                            <Button
                                                className="toggle btn-icon d-md-none"
                                                color="primary"
                                                onClick={() => {
                                                    toggle("add");
                                                }}
                                            >
                                                <Icon name="plus"></Icon>
                                            </Button>
                                            <Button
                                                className="toggle d-none d-md-inline-flex"
                                                color="primary"
                                                onClick={() => {
                                                    toggle("add");
                                                }}
                                            >
                                                <Icon name="plus"></Icon>
                                                <span>Add Roles</span>
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>
                <Block>
                    <Card className="card-bordered">
                        <div className="card-inner-group">
                            <div className="card-inner p-0">
                                <DataTableBody>
                                    <DataTableHead>
                                        <DataTableRow size="sm">
                                            <span>S.NO</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span>Role Name</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>Created Time</span>
                                        </DataTableRow>


                                        <DataTableRow className="nk-tb-col-tools">
                                            <span>Action</span>

                                        </DataTableRow>
                                    </DataTableHead>
                                    {currentItems.length > 0
                                        ? currentItems.map((item) => {
                                            return (
                                                <DataTableItem key={item.id}>
                                                    <DataTableRow size="sm">
                                                        <span className="tb-product">

                                                            <span className="title">{item.id}</span>
                                                        </span>
                                                    </DataTableRow>
                                                    <DataTableRow size="sm">
                                                        <span className="tb-product">

                                                            <span className="title">{item.privilege}</span>
                                                        </span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="tb-sub">{item.create_at}</span>
                                                    </DataTableRow>




                                                    <DataTableRow className="nk-tb-col-tools">
                                                        <ul className="nk-tb-actions gx-1 my-n1">
                                                            <li className="mr-n1 w-100">
                                                                <UncontrolledDropdown>
                                                                    <DropdownToggle
                                                                        tag="a"
                                                                        href="#more"
                                                                        onClick={(ev) => ev.preventDefault()}
                                                                        className="dropdown-toggle btn btn-icon btn-trigger"
                                                                    >
                                                                        <Icon name="more-h"></Icon>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu right>
                                                                        <ul className="link-list-opt no-bdr">
                                                                            {/* <li>
                                                                                <DropdownItem
                                                                                    tag="a"
                                                                                    href="#edit"
                                                                                    onClick={(ev) => {
                                                                                        ev.preventDefault();
                                                                                        onEditClick(item.id);
                                                                                        toggle("edit");
                                                                                    }}
                                                                                >
                                                                                    <Icon name="edit"></Icon>
                                                                                    <span>Edit Product</span>
                                                                                </DropdownItem>
                                                                            </li> */}

                                                                            <li>
                                                                                <DropdownItem
                                                                                    tag="a"
                                                                                    href="#remove"
                                                                                    onClick={(ev) => {
                                                                                        ev.preventDefault();
                                                                                        deleteProduct(item.id);
                                                                                    }}
                                                                                >
                                                                                    <Icon name="trash"></Icon>
                                                                                    <span>Delete Roles</span>
                                                                                </DropdownItem>
                                                                            </li>
                                                                        </ul>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            </li>
                                                        </ul>
                                                    </DataTableRow>
                                                </DataTableItem>
                                            );
                                        })
                                        : null}
                                </DataTableBody>
                                <div className="card-inner">
                                    {data.length > 0 ? (
                                        <PaginationComponent
                                            itemPerPage={itemPerPage}
                                            totalItems={data.length}
                                            paginate={paginate}
                                            currentPage={currentPage}
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <Spinner color="primary" />
                                            <br />
                                            <span className="text-silent">No Roles found</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Block>

                <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
                    <ModalBody>
                        <a href="#cancel" className="close">
                            {" "}
                            <Icon
                                name="cross-sm"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    onFormCancel();
                                }}
                            ></Icon>
                        </a>
                        <div className="p-2">
                            <h5 className="title">Update Product</h5>
                            <div className="mt-4">
                                <form noValidate onSubmit={handleSubmit(onEditSubmit)}>
                                    <Row className="g-3">
                                        <Col size="12">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="product-title">
                                                    Product Title
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="name"
                                                        onChange={(e) => onInputChange(e)}
                                                        ref={register({
                                                            required: "This field is required",
                                                        })}
                                                        defaultValue={formData.name}
                                                    />
                                                    {errors.title && <span className="invalid">{errors.title.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="regular-price">
                                                    Regular Price
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        ref={register({ required: "This is required" })}
                                                        className="form-control"
                                                        defaultValue={formData.price}
                                                    />
                                                    {errors.price && <span className="invalid">{errors.price.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="sale-price">
                                                    Sale Price
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="salePrice"
                                                        ref={register({ required: "This is required" })}
                                                        defaultValue={formData.price}
                                                    />
                                                    {errors.salePrice && <span className="invalid">{errors.salePrice.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="stock">
                                                    Stock
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="stock"
                                                        ref={register({ required: "This is required" })}
                                                        defaultValue={formData.stock}
                                                    />
                                                    {errors.stock && <span className="invalid">{errors.stock.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="SKU">
                                                    SKU
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="sku"
                                                        ref={register({ required: "This is required" })}
                                                        defaultValue={formData.sku}
                                                    />
                                                    {errors.sku && <span className="invalid">{errors.sku.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col size="12">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="category">
                                                    Category
                                                </label>
                                                <div className="form-control-wrap">
                                                    <RSelect
                                                        isMulti
                                                        options={categoryOptions}
                                                        defaultValue={formData.category}
                                                        onChange={onCategoryChange}
                                                    //ref={register({ required: "This is required" })}
                                                    />
                                                    {errors.category && <span className="invalid">{errors.category.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col size="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="category">
                                                    Product Image
                                                </label>
                                                <div className="form-control-wrap">
                                                    <img src={formData.img} alt=""></img>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col size="6">
                                            <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                                                {({ getRootProps, getInputProps }) => (
                                                    <section>
                                                        <div
                                                            {...getRootProps()}
                                                            className="dropzone upload-zone small bg-lighter my-2 dz-clickable"
                                                        >
                                                            <input {...getInputProps()} />
                                                            {files.length === 0 && <p>Drag 'n' drop some files here, or click to select files</p>}
                                                            {files.map((file) => (
                                                                <div
                                                                    key={file.name}
                                                                    className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                                                                >
                                                                    <div className="dz-image">
                                                                        <img src={file.preview} alt="preview" />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </section>
                                                )}
                                            </Dropzone>
                                        </Col>

                                        <Col size="12">
                                            <Button color="primary" type="submit">
                                                <Icon className="plus"></Icon>
                                                <span>Update Product</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
                    <ModalBody>
                        <a href="#cancel" className="close">
                            {" "}
                            <Icon
                                name="cross-sm"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    onFormCancel();
                                }}
                            ></Icon>
                        </a>
                        <div className="nk-modal-head">
                            <h4 className="nk-modal-title title">
                                Product <small className="text-primary">#{formData.sku}</small>
                            </h4>
                            <img src={formData.img} alt="" />
                        </div>
                        <div className="nk-tnx-details mt-sm-3">
                            <Row className="gy-3">
                                <Col lg={6}>
                                    <span className="sub-text">Product Name</span>
                                    <span className="caption-text">{formData.name}</span>
                                </Col>
                                <Col lg={6}>
                                    <span className="sub-text">Product Price</span>
                                    <span className="caption-text">$ {formData.price}</span>
                                </Col>
                                <Col lg={6}>
                                    <span className="sub-text">Product Category</span>
                                    <span className="caption-text">
                                        {formData.category.map((item, index) => (
                                            <Badge key={index} className="mr-1" color="secondary">
                                                {item.value}
                                            </Badge>
                                        ))}
                                    </span>
                                </Col>
                                <Col lg={6}>
                                    <span className="sub-text">Stock</span>
                                    <span className="caption-text"> {formData.stock}</span>
                                </Col>
                            </Row>
                        </div>
                    </ModalBody>
                </Modal>

                <SimpleBar
                    className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.add ? "content-active" : ""
                        }`}
                >
                    <BlockHead>
                        <BlockHeadContent>
                            <BlockTitle tag="h5">Add Roles</BlockTitle>
                        </BlockHeadContent>
                    </BlockHead>
                    <Block>
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                            <Row className="g-3">
                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="product-title">
                                            Role Name
                                        </label>
                                        <div className="form-control-wrap">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                onChange={(e) => onInputChange(e)}
                                                ref={register({
                                                    required: "This field is required",
                                                })}
                                                defaultValue={formData.name}
                                            />
                                            {errors.title && <span className="invalid">{errors.title.message}</span>}
                                        </div>
                                    </div>
                                </Col>


                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="category">
                                            Organization
                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                isMulti
                                                name="category"
                                                options={data_check}
                                                onChange={onCategoryChange}
                                                value={formData.role}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.role && <span className="invalid">{errors.role.message}</span>}
                                        </div>
                                    </div>
                                </Col>
                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="category">
                                            Departments
                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                isMulti
                                                name="category"
                                                options={data_check}
                                                onChange={onCategoryskuChange}
                                                value={formData.sku}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.sku && <span className="invalid">{errors.sku.message}</span>}
                                        </div>
                                    </div>
                                </Col>
                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="category">
                                            Units
                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                isMulti
                                                name="category"
                                                options={data_check}
                                                onChange={onFolderChange}
                                                value={formData.folders}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.folders && <span className="invalid">{errors.folders.message}</span>}
                                        </div>
                                    </div>
                                </Col>

                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="category">
                                            ACL
                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                isMulti
                                                name="category"
                                                options={data_check}
                                                onChange={onAClChange}
                                                value={formData.alc}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.alc && <span className="invalid">{errors.alc.message}</span>}
                                        </div>
                                    </div>
                                </Col>

                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="category">
                                            Custom Fields
                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                isMulti
                                                name="category"
                                                options={data_check}
                                                onChange={onCustomChange}
                                                value={formData.custom_fields}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.custom_fields && <span className="invalid">{errors.custom_fields.message}</span>}
                                        </div>
                                    </div>
                                </Col>
                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="category">
                                            Users
                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                isMulti
                                                name="category"
                                                options={data_check}
                                                onChange={onUsersChange}
                                                value={formData.users}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.users && <span className="invalid">{errors.users.message}</span>}
                                        </div>
                                    </div>
                                </Col>
                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="category">
                                            Roles
                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                isMulti
                                                name="category"
                                                options={data_check}
                                                onChange={onRoleChange}
                                                value={formData.role}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.role && <span className="invalid">{errors.role.message}</span>}
                                        </div>
                                    </div>
                                </Col>




                                <Col size="12">
                                    <Button color="primary" type="submit">
                                        <Icon className="plus"></Icon>
                                        <span>Add Roles</span>
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Block>
                </SimpleBar>

                {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
            </Content>
        </React.Fragment>
    );
};

export default UsersList;
