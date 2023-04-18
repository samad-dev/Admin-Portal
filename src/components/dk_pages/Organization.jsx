import React, { useState, useEffect } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import ProductH from "../../images/product/h.png";
import Dropzone from "react-dropzone";
import SimpleBar from "simplebar-react";
import { Spinner } from "reactstrap"
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
import getPendingOrderApi from "./api/get_cabinet";
import { RSelect } from "../Component";

const CabinetList = () => {
    const [data, setData] = useState([]);
    const [sm, updateSm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",

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

    // Changing state value when searching name

    const fetchData = () => {
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
                console.log(rows);
                setData(rows);
            })
    };

    const fetchAllUsersData = () => {
        var p_id = localStorage.getItem("privilege");
        fetch("/roles/" + p_id, {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => {
                return response.json();
            }).then((datas) => {
                let rows = datas;
                console.log(rows[0]['acl_tab']);
                var acl_tab = rows[0]['acl_tab'];
                acl_tab = acl_tab.replaceAll("'", '"');
                console.log("Samad " + acl_tab);
                setData(rows);
            })
    };


    useEffect(() => {
        if (onSearchText !== "") {
            const filteredObject = data.filter((item) => {
                // return item.toLowerCase().includes(onSearchText.toLowerCase());
                if (item.org_name.toLowerCase().includes(onSearchText.toLowerCase())) {

                    return item.org_name.toLowerCase().includes(onSearchText.toLowerCase());
                  }
                  else if (item.created_on.toLowerCase().includes(onSearchText.toLowerCase())){
                    return item.created_on.toLowerCase().includes(onSearchText.toLowerCase());
          
                  }
            });
            setData([...filteredObject]);
        }
        else {
            // setData([...productData]);
            fetchData();

        }
        // const interval = setInterval(() => {
        //   changeData();
        // }, 5000);
        // return () => clearInterval(interval);
    }, [onSearchText]);

    // OnChange function to get the input data
    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // category change
    const onCategoryChange = (value) => {
        setFormData({ ...formData, category: value });
    };

    // function to close the form modal
    const onFormCancel = () => {
        setView({ edit: false, add: false, details: false });
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: "",

        });
        reset({});
    };

    const onFormSubmit = (form) => {
        const { title, price, sku, stock } = form;
        let submittedData = {
            id: data.length + 1,
            name: title,

        };

        var today = new Date();
        let inserted = {
            "org_name": title,
            "created_on": today,
            "created_by": "1"
        };
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(inserted);
        console.log(raw);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("/orgs", requestOptions)
            .then(response => response.text())
            .then(result => fetchData())
            .catch(error => console.log('error', error));


        // setData([submittedData, ...data]);
        setView({ open: false });
        setFiles([]);
        resetForm();
    };

    const onEditSubmit = () => {
        console.log(editId);
        console.log(formData.name);

        if (formData.name != "") {

            Swal.fire({
                title: 'Are you sure to Update?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    var raw = JSON.stringify({
                        "id": editId,
                        "org_name": formData.name,
                        "created_on": "2022-08-15",
                        "created_by": "1"
                    });

                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };

                    fetch("/orgs", requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            console.log(result)
                            fetchData();

                            Swal.fire(
                                'Update!',
                                'Your Record has been Updated.',
                                'success'
                            )
                            resetForm();
                            setView({ edit: false, add: false });
                        })
                        .catch(error => console.log('error', error));

                }
            })

        }
        else {
            Swal.fire(
                'Field is empty?',
                'Please fill field value'
            )

        }

        let submittedData;
        // let newItems = data;
        // let index = newItems.findIndex((item) => item.id === editId);

        // newItems.forEach((item) => {
        //     if (item.id === editId) {
        //         submittedData = {
        //             id: editId,
        //             name: formData.name,

        //         };
        //     }
        // });
        // newItems[index] = submittedData;
        // //setData(newItems);

    };

    // function that loads the want to editted data
    const onEditClick = (id) => {
        console.log(data);
        if (id != "") {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("/org/" + id + "", requestOptions)
                .then(response => response.text())
                .then(result => {
                    var res = JSON.parse(result);
                    console.log(res)
                    var orgs_name = res.org_name;
                    setFormData({
                        name: orgs_name,

                    });
                })

                .catch(error => console.log('error', error));
        }
        // data.forEach((item) => {
        //     if (item.id === id) {
        //         setFormData({
        //             name: item.org_name,

        //         });
        //     }
        // });
        setEditedId(id);
        setFiles([]);
        setView({ add: false, edit: true });
    };

    // selects all the products
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

                fetch("/org/" + id + "", requestOptions)
                    .then(response => response.text())
                    .then((result) => {
                        Swal.fire("Deleted!", "Organization has been deleted.", "success");
                        console.log(result);
                        let defaultData = data;
                        defaultData = defaultData.filter((item) => item.id !== id);
                        setData([...defaultData]);
                    })
                    .catch(error => Swal.fire("Error!", error, "Failed"));

            }
        });
       
        // setEditedId(id);
        // setFiles([]);
        // setView({ add: false, edit: true });
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
                            <BlockTitle>Organization</BlockTitle>
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
                                                    placeholder="Quick search by ORG"
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
                                                <span>Add  Organization</span>
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
                                            <span>ID</span>
                                        </DataTableRow>
                                        <DataTableRow size="sm">
                                            <span>Organization Name</span>
                                        </DataTableRow>
                                        <DataTableRow>
                                            <span>Created TIme</span>
                                        </DataTableRow>
                                        <DataTableRow >
                                            <span>Action</span>
                                        </DataTableRow>

                                        {/* <DataTableRow className="nk-tb-col-tools">
                      <ul className="nk-tb-actions gx-1 my-n1">
                        <li className="mr-n1">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              tag="a"
                              href="#toggle"
                              onClick={(ev) => ev.preventDefault()}
                              className="dropdown-toggle btn btn-icon btn-trigger"
                            >
                              <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <ul className="link-list-opt no-bdr">
                                <li>
                                  <DropdownItem tag="a" href="#edit" onClick={(ev) => ev.preventDefault()}>
                                    <Icon name="edit"></Icon>
                                    <span>Edit Selected</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem
                                    tag="a"
                                    href="#remove"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      selectorDeleteProduct();
                                    }}
                                  >
                                    <Icon name="trash"></Icon>
                                    <span>Remove Selected</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem tag="a" href="#stock" onClick={(ev) => ev.preventDefault()}>
                                    <Icon name="bar-c"></Icon>
                                    <span>Update Stock</span>
                                  </DropdownItem>
                                </li>
                                <li>
                                  <DropdownItem tag="a" href="#price" onClick={(ev) => ev.preventDefault()}>
                                    <Icon name="invest"></Icon>
                                    <span>Update Price</span>
                                  </DropdownItem>
                                </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </li>
                      </ul>
                    </DataTableRow> */}
                                    </DataTableHead>
                                    {currentItems.length > 0
                                        ? currentItems.map((item) => {
                                            return (
                                                <DataTableItem key={item.id}>
                                                    {/* <DataTableRow className="nk-tb-col-check">
                            <div className="custom-control custom-control-sm custom-checkbox notext">
                              <input
                                type="checkbox"
                                className="custom-control-input form-control"
                                defaultChecked={item.check}
                                id={item.id + "uid1"}
                                key={Math.random()}
                                onChange={(e) => onSelectChange(e, item.id)}
                              />
                              <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                            </div>
                          </DataTableRow> */}
                                                    <DataTableRow size="sm">
                                                        <span className="tb-product">
                                                            {/* <img src={item.img ? item.img : ProductH} alt="product" className="thumb" /> */}
                                                            <span className="title">{item.id}</span>
                                                        </span>
                                                    </DataTableRow>
                                                    <DataTableRow size="sm">
                                                        <span className="tb-product">
                                                            {/* <img src={item.img ? item.img : ProductH} alt="product" className="thumb" /> */}
                                                            <span className="title">{item.org_name}</span>
                                                        </span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span className="tb-sub">{item.created_on}</span>
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
                                                                                    <span>Edit Organization Name</span>
                                                                                </DropdownItem>
                                                                            </li>
                                                                            {/* <li>
                                                                                <DropdownItem
                                                                                    tag="a"
                                                                                    href="#view"
                                                                                    onClick={(ev) => {
                                                                                        ev.preventDefault();
                                                                                        onEditClick(item.id);
                                                                                        toggle("details");
                                                                                    }}
                                                                                >
                                                                                    <Icon name="eye"></Icon>
                                                                                    <span>View Product</span>
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
                                                                                    <span>Delete Organization</span>
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
                                            <span className="text-silent">No Organization found</span>
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
                            <h5 className="title">Update Organization Name</h5>
                            <div className="mt-4">
                                <form noValidate onSubmit={handleSubmit(onEditSubmit)}>
                                    <Row className="g-3">
                                        <Col size="12">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="product-title">
                                                    Organization Name
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


                                        <Col size="12">
                                            <Button color="primary" type="submit">
                                                <Icon className="plus"></Icon>
                                                <span>Update Organization</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                {/* <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
        </Modal> */}

                <SimpleBar
                    className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.add ? "content-active" : ""
                        }`}
                >
                    <BlockHead>
                        <BlockHeadContent>
                            <BlockTitle tag="h5">Add  Organization</BlockTitle>

                        </BlockHeadContent>
                    </BlockHead>
                    <Block>
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                            <Row className="g-3">
                                <Col size="12">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="product-title">
                                            Organization Name
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
                                    <Button color="primary" type="submit">
                                        <Icon className="plus"></Icon>
                                        <span>Add  Organization</span>
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

export default CabinetList;
