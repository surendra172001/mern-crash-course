import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: "Please fill all the fields" };
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      const jsonRes = await res.json();
      const { data } = jsonRes;
      set((state) => ({ products: [...state.products, data] }));
      return { success: true, message: "Product created successfully" };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: "Product creation fialed, server error",
      };
    }
  },
  fetchProducts: async () => {
    try {
      const res = await fetch("/api/products");
      const jsonRes = await res.json();
      set({ products: jsonRes.data });
    } catch (error) {
      console.log("Error getting all products :", error.message);
    }
  },
  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
      });
      const jsonRes = await res.json();
      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));
      return jsonRes;
    } catch (error) {
      console.log("Error getting all products :", error.message);
    }
  },
  updateProduct: async (pid, updatedProduct) => {
    if (
      !updatedProduct.name ||
      !updatedProduct.price ||
      !updatedProduct.image
    ) {
      return { success: false, message: "Please fill all the fields" };
    }
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      const jsonRes = await res.json();
      const { data } = jsonRes;
      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data : product
        ),
      }));
      return { success: true, message: "Product updated successfully" };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: "Product updation fialed, server error",
      };
    }
  },
}));
