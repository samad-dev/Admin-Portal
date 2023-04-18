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

const AclList = () => {
    const [data, setData] = useState([]);
    const [cabinets, setCabinetData] = useState([]);
    const [folderss, setFoldersData] = useState([]);
    const [orgs, setOrgsData] = useState([]);
    const [userss, setUsersData] = useState([]);

    const [sm, updateSm] = useState(false);
    const [formData, setFormData] = useState({
        name: [],
        sku: [],
        category: [],
        orgas: [],
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

    const fetch_Cabinets_Data = () => {
        fetch("/cabinets", {
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
                    obj['label'] = fruits[i]['cabinet_name'];
                    arr.push(obj);
                }

                // console.log(arr);
                setCabinetData(arr);
            })
    };


    const fetch_organization_Data = () => {
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

                console.log(arr);
                setOrgsData(arr);
            })
    };
    const fetch_Folders_Data = () => {
        fetch("/foldercab", {
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
                    obj['label'] = fruits[i]['folder_name'];
                    arr.push(obj);
                }

                console.log(arr);
                setFoldersData(arr);
            })
    };

    const fetch_Users_Data = () => {
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
                // console.log(rows);

                var arr = [],
                    obj,
                    fruits = rows,
                    i;

                for (i = 0; i < fruits.length; i++) {
                    obj = {}; // <----- new Object

                    obj['value'] = fruits[i]['id'];
                    obj['label'] = fruits[i]['username'];
                    arr.push(obj);
                }

                console.log(arr);
                setUsersData(arr);
            })
    };

    const fetchAllUsersData = () => {
        fetch("/acl", {
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
               
                 if (item.acl_id.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.acl_id.toLowerCase().includes(onSearchText.toLowerCase());
                }
                else if (item.username.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.username.toLowerCase().includes(onSearchText.toLowerCase());
                }
                else if (item.org_name.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.org_name.toLowerCase().includes(onSearchText.toLowerCase());
                }
                else if (item.cabinet_name.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.cabinet_name.toLowerCase().includes(onSearchText.toLowerCase());

                }
                else if (item.expr1.toLowerCase().includes(onSearchText.toLowerCase())) {
                    return item.expr1.toLowerCase().includes(onSearchText.toLowerCase());

                }
                

            });
            setData([...filteredObject]);
        } else 
        {
            // fetch_Cabinets_Data();
            // fetch_Folders_Data();
            fetch_Users_Data();
            fetchAllUsersData();
            fetch_organization_Data();
        }
    }, [onSearchText]);

    // OnChange function to get the input data
    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // category change
    const onCategoryChange = (value) => {
        setFormData({ ...formData, category: value });
    };

    const onCategoryorgChange = (value) => {
        console.log(value.value)
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("/orgcab/" + value.value + "", requestOptions)
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
                    obj['label'] = fruits[i]['cabinet_name'];
                    arr.push(obj);
                }

                console.log(arr);
                setCabinetData(arr);
            })
            .catch(error => console.log('error', error));


        setFormData({ ...formData, orgas: value });
    };
    const onCategoryskuChange = (value) => {
        console.log(value.value)
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("/cabinets/" + value.value + "", requestOptions)
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
                    obj['label'] = fruits[i]['folder_name'];
                    arr.push(obj);
                }

                console.log(arr);
                setFoldersData(arr);
            })
            .catch(error => console.log('error', error));


        setFormData({ ...formData, sku: value });
    };
    const onCategorynameChange = (value) => {
        setFormData({ ...formData, name: value });
    };

    // function to close the form modal
    const onFormCancel = () => {
        setView({ edit: false, add: false, details: false });
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: [],
            sku: [],
            category: [],
            orgas: [],
        });
        reset({});
    };

    const onFormSubmit = (form) => {
        const { name, sku } = form;
        let submittedData = {
            id: data.length + 1,
            name: formData.name,
            cabinet: formData.sku,
            category: formData.category,
        };
        let multi_folder = formData.category;

        // console.log(multi_folder);
        for (var i = 0; i < multi_folder.length; i++) {
            var canbinet_id = Object.values(formData.sku);
            var user_id = Object.values(formData.name);
            var orgas_id = Object.values(formData.orgas);
            var today = new Date();

            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds
            let inserted = {
                "cabinet_id": canbinet_id[0],
                "folder_id": multi_folder[i]['value'],
                "org_id": orgas_id[0],
                "user_id": user_id[0],
                "created_at": today,
                "created_by": "1"
            };

            console.log(inserted);

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify(inserted);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("/acl", requestOptions)
                .then(response => response.text())
                .then((result) => {
                    console.log(result);
                    fetchAllUsersData();
                })
                .catch(error => console.log('error', error));
        }

        // setData([submittedData, ...data]);

        setView({ open: false });
        setFiles([]);
        resetForm();
    };

    const onEditSubmit = () => {
        let submittedData;
        let newItems = data;
        let index = newItems.findIndex((item) => item.acl_id === editId);

        newItems.forEach((item) => {
            if (item.acl_id === editId) {
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
            if (item.acl_id === id) {
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
        let index = newData.findIndex((item) => item.acl_id === id);
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

                fetch("/acl/" + id + "", requestOptions)
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
                            <BlockTitle>ACL</BlockTitle>
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
                                                    placeholder="Quick search by Username"
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
                                                <span>Add ACL</span>
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
                                        <DataTableRow size="sm">
                                            <span>Organization Name</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>Department Name</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>Unit Name</span>
                                        </DataTableRow>
                                        <DataTableRow className="nk-tb-col-tools">
                                            <span>Action</span>

                                        </DataTableRow>
                                    </DataTableHead>
                                    {currentItems.length > 0
                                        ? currentItems.map((item) => {
                                            return (
                                                <DataTableItem key={item.acl_id}>
                                                    <DataTableRow size="sm">
                                                        <span className="tb-product">

                                                            <span className="title">{item.acl_id}</span>
                                                        </span>
                                                    </DataTableRow>
                                                    <DataTableRow size="sm">
                                                        <span className="tb-product">

                                                            <span className="title">{item.username}</span>
                                                        </span>
                                                    </DataTableRow>
                                                    <DataTableRow size="sm">
                                                        <span className="tb-product">

                                                            <span className="title">{item.org_name}</span>
                                                        </span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="tb-sub">{item.cabinet_name}</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="tb-sub">{item.expr1}</span>
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
                                                                                        onEditClick(item.acl_id);
                                                                                        toggle("edit");
                                                                                    }}
                                                                                >
                                                                                    <Icon name="edit"></Icon>
                                                                                    <span>Edit ACL</span>
                                                                                </DropdownItem>
                                                                            </li> */}

                                                                            <li>
                                                                                <DropdownItem
                                                                                    tag="a"
                                                                                    href="#remove"
                                                                                    onClick={(ev) => {
                                                                                        ev.preventDefault();
                                                                                        deleteProduct(item.acl_id);
                                                                                    }}
                                                                                >
                                                                                    <Icon name="trash"></Icon>
                                                                                    <span>Remove ACL</span>
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
                                            <span className="text-silent">No ACL found</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Block>





                <SimpleBar
                    className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.add ? "content-active" : ""
                        }`}
                >
                    <BlockHead>
                        <BlockHeadContent>
                            <BlockTitle tag="h5">Add ACL</BlockTitle>
                        </BlockHeadContent>
                    </BlockHead>
                    <Block>
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                            <Row className="g-3">
                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="product-title">
                                            Users
                                        </label>
                                        <div className="form-control-wrap">
                                            {/* <input
                        type="text"
                        className="form-control"
                        name="title"
                        onChange={(e) => onInputChange(e)}
                        ref={register({
                          required: "This field is required",
                        })}
                        defaultValue={formData.name}
                      /> */}
                                            <RSelect
                                                // isMulti

                                                options={userss}
                                                onChange={onCategorynameChange}
                                                value={formData.name}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.title && <span className="invalid">{errors.title.message}</span>}
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
                                                options={orgs}
                                                onChange={onCategoryorgChange}
                                                value={formData.orgas}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.orgas && <span className="invalid">{errors.orgas.message}</span>}
                                        </div>
                                    </div>
                                </Col>

                                <Col md="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="SKU">
                                            Departments
                                        </label>
                                        <div className="form-control-wrap">

                                            <RSelect
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
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="category">
                                            Units
                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                isMulti
                                                options={folderss}
                                                onChange={onCategoryChange}
                                                value={formData.category.value}
                                                ref={register({ required: "This is required" })}
                                            />
                                            {errors.category && <span className="invalid">{errors.category.message}</span>}
                                        </div>
                                    </div>
                                </Col>


                                <Col size="12">
                                    <Button color="primary" type="submit">
                                        <Icon className="plus"></Icon>
                                        <span>Add ACL</span>
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

export default AclList;
