import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProductList } from "../features/productSlice";
import { reset } from "../features/productSlice";
import axios from "axios";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { Col, Row } from "react-bootstrap";

const HomeScreen = () => {
  const { isError, isLoading, isSuccess, message, products } = useSelector(
    (state) => state.productList
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
  }, [dispatch, isSuccess]);

  return (
    <>
      <h1>Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant='danger'>{message}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
