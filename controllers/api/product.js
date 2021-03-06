const Product = require("../../models/product");

exports.findAll = (req, res) => {
    Product.findAll()
        .then(([rows]) => {
            res.send(rows);
        })
        .catch(err => res.send(err));
};

exports.destroy = (req, res) => {
    const productId = req.params.productId;
    Product.deleteByPK(productId)
        .then(response => res.send(response))
        .catch(err => res.send(err));
};

exports.create = (req, res) => {
    const { title, categoryName, price, stock } = req.body;
    const product = new Product(title, categoryName, price, stock);
    product
        .save()
        .then(response => res.send(response))
        .catch(err => res.send(err));
};

exports.update = (req, res) => {
    const productId = req.params.productId;
    Product.updateByPK(productId, req.body)
        .then(response => res.send(response))
        .catch(err => res.send(err));
};
