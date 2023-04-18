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

const UsersList = () => {
    const [data, setData] = useState([]);
    const [edit_data, userEdit] = useState([]);
    const [cabinets, setCabinetData] = useState([]);
    const [roles, setRolesData] = useState([]);
    const [loading, setLoading] = useState(false);


    const [sm, updateSm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        img: null,
        sku: [],
        role: [],
        stock: "",
        category: [],
        fav: false,
        check: false,
        password_update: "",
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
    var user_id = localStorage.getItem("id");

    const fetch_Cabinets_Data = () => {
        fetch("/orgs", {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                return response.json();
            }).then((datas) => {
                let rows = datas;
                // console.log(rows);

                var arr = [],
                    obj,
                    fruits = rows,
                    i;

                for (i = 0; i < fruits.length; i++) {
                    obj = {}; // <----- new Object

                    obj['value'] = fruits[i]['id'];
                    obj['label'] = fruits[i]['org_name'];
                    arr.push(obj);
                }

                // console.log(arr);
                setCabinetData(arr);
            })
    };
    const fetch_ROles_Data = () => {
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
                // console.log(rows);

                var arr = [],
                    obj,
                    fruits = rows,
                    i;

                for (i = 0; i < fruits.length; i++) {
                    obj = {}; // <----- new Object

                    obj['value'] = fruits[i]['id'];
                    obj['label'] = fruits[i]['privilege'];
                    arr.push(obj);
                }

                // console.log(arr);
                setRolesData(arr);
            })
    };

    const fetchAllUsersData = () => {
        fetch("/users", {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                return response.json();
            }).then((datas) => {
                let rows = datas;
                console.log(rows);
                setData(rows);
            })
    };
    // Changing state value when searching name
    useEffect(() => {
        if (onSearchText !== "") {
            const filteredObject = data.filter((item) => {
                // return item.username.toLowerCase().includes(onSearchText.toLowerCase());
                if (item.username.toLowerCase().includes(onSearchText.toLowerCase())) {

                    return item.username.toLowerCase().includes(onSearchText.toLowerCase());
                }
                else if (item.email.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.email.toLowerCase().includes(onSearchText.toLowerCase());
                }

            });
            setData([...filteredObject]);
        } else {
            fetchAllUsersData();
            fetch_Cabinets_Data();
            fetch_ROles_Data();
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

    // function to close the form modal
    const onFormCancel = () => {
        setView({ edit: false, add: false, details: false });
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: "",
            img: null,
            sku: [],
            role: [],
            stock: "",
            category: [],
            fav: false,
            check: false,
            password_update: "",
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


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var role_id = Object.values(formData.role);
        var canbinet_id = Object.values(formData.sku);
        var today = new Date();

        let inserted = {
            "username": title,
            "privilege": role_id[0],
            "email": price,
            "passwrod": salePrice,
            "isActive": "1",
            "cab_id": canbinet_id[0],
            "created_at": today,
            "created_by": "1"
        };
        // console.log(inserted);

        var raw = JSON.stringify(inserted);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/users", requestOptions)
            .then(response => response.text())
            .then((result) => {
                console.log(result);
                fetchAllUsersData();
            })
            .catch(error => console.log('error', error));



        // setData([submittedData, ...data]);
        setView({ open: false });
        setFiles([]);
        resetForm();
    };

    const onEditSubmit = () => {
        setLoading(true);
        var formdata = new FormData();
        if (files.length > 0) {
            // for (var i = 0; i < files.length; i++) {

            // }

            console.log(files[0]);
            formdata.append("file", files[0]);
            formdata.append("userid", editId);
            console.log(formdata);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            fetch("/sign", requestOptions)
                .then(response => {
                    console.log(response.status);
                    if (response.status == 200) {
                        fetchAllUsersData();
                        setLoading(false);
                        Swal.fire(
                            'Uploaded!',
                            'Your Signature has been Updated.',
                            'success'
                        )


                        resetForm();
                        setFiles([]);
                        setView({ edit: false, add: false });
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Signature Not Updated!'

                        });
                        setLoading(false);
                    }
                    return response.json();
                })
                .then(result => {
                    console.log("HAmza")
                    console.log(result)
                })
                .catch(error => console.log('errors', error));


        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Select Your Signature!'

            });
            setLoading(false);
        }



        //setData(newItems);
        // resetForm();
        // setView({ edit: false, add: false });
    };
    const updatePassSubmit = () => {
        console.log(edit_data);
        setLoading(true);
        if (formData.title != "" && formData.salePrice != "" && formData.price != "") {
            console.log(formData.title);
            console.log(formData.salePrice);
            console.log(formData.price);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "id": editId,
                "username": formData.title,
                "privilege": edit_data.privilege,
                "email": formData.price,
                "passwrod": formData.salePrice,
                "isActive": edit_data.isActive,
                "cab_id": edit_data.cab_id,
                "created_at": edit_data.created_at,
                "created_by": edit_data.created_by
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("/users", requestOptions)
                .then(response => {
                    console.log(response.status);
                    if (response.status == 201) {
                        fetchAllUsersData();
                        setLoading(false);
                        Swal.fire(
                            'Uploaded!',
                            'User Updated Successfully.',
                            'success'
                        )


                        resetForm();
                        setView({ edit: false, add: false,  details: false });
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'User Not Updated!'

                        });
                        setLoading(false);
                    }
                    return response.json();
                })
                .then(result => console.log(result))
                .catch(error => console.log('error', error));


        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Fill Complete Form!'

            });
            setLoading(false);
        }



        //setData(newItems);
        // resetForm();
        // setView({ edit: false, add: false });
    };

    // function that loads the want to editted data
    const onEditClick = (id) => {

        console.log(id);
        setEditedId(id);
        setFiles([]);
        setView({ add: false, edit: true });
    };

    const onpassClick = (data) => {
        userEdit(data)
        setFormData({
            title: data.username,
            price: data.email,
            salePrice: data.passwrod,

        });
        console.log(data);
        setEditedId(data.id);
        // setFiles([]);
        // setView({ add: false, edit: true });
    };

    // selects all the Users
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
        // let defaultData = data;
        // defaultData = defaultData.filter((item) => item.id !== id);
        // setData([...defaultData]);



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

                fetch("/users/" + id + "", requestOptions)
                    .then(response => response.text())
                    .then((result) => {
                        console.log(result);
                        fetchAllUsersData();
                    })
                    .catch(error => console.log('error', error));

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
                            <BlockTitle>Users</BlockTitle>
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
                                                    placeholder="Quick search by User Name"
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
                                                <span>Add Users</span>
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
                                            <span>User Name</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>Email</span>
                                        </DataTableRow>
                                        {/* <DataTableRow>
                                            <span>Password</span>
                                        </DataTableRow> */}
                                        {/* <DataTableRow>
                                            <span>privilege</span>
                                        </DataTableRow>
                                        <DataTableRow size="md">
                                            <span>Status</span>
                                        </DataTableRow> */}
                                        {/* <DataTableRow size="md">
                                            <Icon name="star-round" className="tb-asterisk"></Icon>
                                        </DataTableRow> */}
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

                                                            <span className="title">{item.username}</span>
                                                        </span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="tb-sub">{item.email}</span>
                                                    </DataTableRow>
                                                    {/* <DataTableRow>
                                                        <span className="tb-sub">{item.passwrod}</span>
                                                    </DataTableRow> */}
                                                    {/* <DataTableRow>
                                                        <span className="tb-sub">{item.privilege}</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="tb-sub">{item.isActive}</span>
                                                    </DataTableRow> */}

                                                    {/* <DataTableRow size="md">
                                                        <div className="asterisk tb-asterisk">
                                                            <a
                                                                href="#asterisk"
                                                                className={item.isActive ? "1" : ""}
                                                                onClick={(ev) => ev.preventDefault()}
                                                            >
                                                                <Icon name="star" className="asterisk-off"></Icon>
                                                                <Icon name="star-fill" className="asterisk-on"></Icon>
                                                            </a>
                                                        </div>
                                                    </DataTableRow> */}
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
                                                                            <li>
                                                                                <DropdownItem
                                                                                    tag="a"
                                                                                    href="#edit"
                                                                                    onClick={(ev) => {
                                                                                        ev.preventDefault();
                                                                                        onpassClick(item);
                                                                                        toggle("details");
                                                                                    }}
                                                                                >
                                                                                    <Icon name="edit"></Icon>
                                                                                    <span>Update Password</span>
                                                                                </DropdownItem>
                                                                            </li>
                                                                            <li>
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
                                                                                    <span>Add signature</span>
                                                                                </DropdownItem>
                                                                            </li>

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
                                                                                    <span>Delete Users</span>
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
                                            <span className="text-silent">No Users found</span>
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
                            <h5 className="title">Update Signature</h5>
                            <div className="mt-4">
                                <form noValidate >
                                    <Row className="g-3">

                                        <Col size="12">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="category">
                                                    Signature
                                                </label>
                                                <div className="form-control-wrap">
                                                    <img src={formData.img} alt=""></img>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col size="12">
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
                                            <Button color="primary" type="button" onClick={onEditSubmit}>
                                                <Icon className="plus"></Icon>
                                                {/* <span>Add  File</span> */}

                                                {loading ? <Spinner size="sm" color="light" /> : "Update Signature"}                                    </Button>
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
                        <div className="p-2">
                            <h5 className="title">Update Password</h5>
                            <div className="mt-4">
                                <form noValidate >
                                    <Row className="g-3">

                                        <Col size="12">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="product-title">
                                                    Username
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
                                                        defaultValue={formData.title}
                                                    />
                                                    {errors.title && <span className="invalid">{errors.title.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="12">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="regular-price">
                                                    Email
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        type="email"
                                                        name="price"
                                                        readOnly
                                                        ref={register({ required: "This is required" })}
                                                        onChange={(e) => onInputChange(e)}
                                                        className="form-control"
                                                        defaultValue={formData.price}
                                                    />
                                                    {errors.price && <span className="invalid">{errors.price.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="12">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="sale-price">
                                                    Password
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="salePrice"
                                                        onChange={(e) => onInputChange(e)}
                                                        ref={register({ required: "This is required" })}
                                                        defaultValue={formData.salePrice}
                                                    />
                                                    {errors.salePrice && <span className="invalid">{errors.salePrice.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col size="12">
                                            <Button color="primary" type="button" onClick={updatePassSubmit}>
                                                <Icon className="plus"></Icon>
                                                {/* <span>Add  File</span> */}

                                                {loading ? <Spinner size="sm" color="light" /> : "Update Password"}                                    </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                <SimpleBar
                    className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.add ? "content-active" : ""
                        }`}
                >
                    <BlockHead>
                        <BlockHeadContent>
                            <BlockTitle tag="h5">Add Users</BlockTitle>
                        </BlockHeadContent>
                    </BlockHead>
                    <Block>
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                            <Row className="g-3">
                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="product-title">
                                            Username
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
                                <Col md="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="regular-price">
                                            Email
                                        </label>
                                        <div className="form-control-wrap">
                                            <input
                                                type="email"
                                                name="price"
                                                ref={register({ required: "This is required" })}
                                                onChange={(e) => onInputChange(e)}
                                                className="form-control"
                                                defaultValue={formData.price}
                                            />
                                            {errors.price && <span className="invalid">{errors.price.message}</span>}
                                        </div>
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="sale-price">
                                            Password
                                        </label>
                                        <div className="form-control-wrap">
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="salePrice"
                                                onChange={(e) => onInputChange(e)}
                                                ref={register({ required: "This is required" })}
                                                defaultValue={formData.stock}
                                            />
                                            {errors.stock && <span className="invalid">{errors.stock.message}</span>}
                                        </div>
                                    </div>
                                </Col>
                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="category">
                                            Role
                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                name="category"
                                                options={roles}
                                                onChange={onCategoryChange}
                                                value={formData.role}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.role && <span className="invalid">{errors.role.message}</span>}
                                        </div>
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="SKU">
                                            Organizations
                                        </label>
                                        <div className="form-control-wrap">

                                            <RSelect
                                                name="cabinet"
                                                options={cabinets}
                                                onChange={onCategoryskuChange}
                                                value={formData.sku}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.sku && <span className="invalid">{errors.sku.message}</span>}
                                        </div>
                                    </div>
                                </Col>


                                <Col size="12">
                                    <Button color="primary" type="submit">
                                        <Icon className="plus"></Icon>
                                        <span>Add Users</span>
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
