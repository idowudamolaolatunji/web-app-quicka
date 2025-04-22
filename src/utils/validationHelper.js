export function validateOnboardForm(data, method) {
	const errors = {};

	if (!data.name.trim()) {
		errors.name = "Business name is required";
	} else if (data.name.length < 3) {
		errors.name = "Business name must be more than 3 characters long";
	} else if (data.name.trim() && !data.subdomain) {
		errors.subdomain = "A URL is needed for your store";
	}

	if(method == "google" || method == "manage") {
		if (!data?.phone.trim()) {
			errors.phone = "Phone number is required";
		} else if (data?.phone.length < 12) {
			errors.phone = `Phone number must have 9 - 10 numbers after +${data.dialCode}`;
		}
	}

	if (data.isRegistered == "yes" && !data.regType) {
		errors.type = "Registeration type is required";
	}
	if (data.selectedCategory.length < 1 && !data.selectedCategory.name) {
		errors.category = "Choosing a store category is required";
	}

	return errors;
}

export function validateAuthForm(data, type) {
	const errors = {};

	if (type === "login") {
		if (!data.email.trim()) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(data.email)) {
			errors.email = "Email is invalid";
		}

		if (!data.password) {
			errors.password = "Password is required";
		} else if (data.password.length < 8) {
			errors.password = "Password must be at least 8 characters long";
		}

		return errors;
	}

	if (type === "signup") {
		if (!data.firstname.trim()) {
			errors.firstname = "Firstname is required";
		} else if (data.firstname.length < 3) {
			errors.firstname = "Firstname must be at least 3 characters long";
		}
		if (!data.lastname.trim()) {
			errors.lastname = "Lastname is required";
		} else if (data.lastname.length < 3) {
			errors.lastname = "Lastname must be at least 3 characters long";
		}

		if (!data.email.trim()) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(data.email)) {
			errors.email = "Email is invalid";
		}

		if (!data?.phone.trim()) {
			errors.phone = "Phone number is required";
		} else if (data?.phone.length < 12) {
			errors.phone = `Phone number must have 9 - 10 numbers after +${data.dialCode}`;
		}

		if (!data.password) {
			errors.password = "Password is required";
		} else if (data.password.length < 8) {
			errors.password = "Password must be at least 8 characters long";
		}

		if (!data.passwordConfirm) {
			errors.passwordConfirm = "Password comfirmation is required";
		} else if (data.passwordConfirm !== data.password) {
			errors.passwordConfirm = "Passwords do not match";
		}

		return errors;
	}

	if (type === "verify_otp") {
		if (!data?.otp.trim()) {
			errors.otp = "OTP code is required";
		} else if (data.otp.length < 4) {
			errors.otp = "OTP must be be 4 character long";
		}

		return errors;
	}

	if (type === "forgot_password") {
		if (!data.email.trim()) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(data.email)) {
			errors.email = "Email is invalid";
		}

		return errors;
	}

	if (type === "reset_password") {
		if (!data.password) {
			errors.password = "Password is required";
		} else if (data.password.length < 8) {
			errors.password = "Password must be at least 8 characters long";
		}

		if (!data.passwordConfirm) {
			errors.passwordConfirm = "Password comfirmation is required";
		} else if (data.passwordConfirm !== data.password) {
			errors.passwordConfirm = "Passwords do not match";
		}
		
		return errors;
	}
}

export function validateProductForm(data, _) {
	const errors = {};

	if (!data.name.trim()) {
		errors.name = "Produt title is required";
	} else if (data.name.length < 3) {
		errors.name = "Produt title must be more than 3 characters!";
	}

	if (!data.price) {
		errors.price = "Price is required";
	} else if (+data.price < 500) {
		errors.price = "Price must not be less than 500";
	} else if (+data.price <= +data.itemCost) {
		errors.itemCost = "Price cannot be more than or the same as cost price";
	}

	if (data.inventory && !data.stockAmount) {
		errors.stockAmount = "Stock Quantity is required";
	} else if (data.inventory && +data.stockAmount < 1) {
		errors.stockAmount = "Stock Quantity cannot be less than 1";
	}

	if (data.discountType != "no-discount" && !data.discountValue) {
		errors.discountValue = "Discount is required";
	}

	if (data.images.length === 0) {
		errors.images = "Produt image is required";
	}

	if (!data.description.trim()) {
		errors.description = "Produt description is required";
	}

	if (data.productCollection.length < 1 && !data.productCollection.name) {
		errors.productCollection = "Produt collection is required";
	}

	return errors;
}

export function validateOrderForm(data, _) {
	const errors = {};

	if (!data.orderDate.trim()) {
		errors.orderDate = "Order date is required";
	}
	
	if (data.orderProducts.length < 1) {
		errors.orderProducts = "Product(s) ordered is required";
	} else {
		data?.orderProducts.forEach((product, i) => {
			if(product?.trackInventory && product?.stockAmount < 1) {
				console.log("Hi there", product)
				errors.orderProducts = `Item ${i+1} is out of stock`;
			} else if(product?.trackInventory && product?.stockAmount < data?.selectedProducts[i]?.quantity) {
				errors.orderProducts = `Cannot sell more the stock amount for item ${i+1}`;
			}
		})
	}

	if (data.paymentStatus != "unpaid" && data.paymentMethod.length < 1 && !data.paymentMethod.value) {
		errors.paymentMethod = "Payment method is required";
	}
	if (data.deliveryStatus.length < 1 && !data.deliveryStatus.value) {
		errors.deliveryStatus = "Delivery status is required";
	}
	if (data.channel.length < 1 && !data.channel.value) {
		errors.channel = "Produt collection is required";
	}

	return errors;
}

export function validateDeliveryForm(data, _) {
	const errors = {};

	if (!data.title.trim()) {
		errors.title = "Delivery title is required";
	} else if (data.title.length < 3) {
		errors.title = "Delivery title must be more than 3 characters!";
	}
	
	if (data.deliveryType == "paid" && !+data.fee) {
		errors.fee = "A fee is required";
	}

	return errors;
}

export function validateCustomerForm(data, _) {
	const errors = {};

	if (!data.firstname.trim()) {
		errors.firstname = "Firstname is required";
	} else if (data.firstname.length < 3) {
		errors.firstname = "Firstname must be at least 3 characters long";
	}
	if (!data?.lastname?.trim()) {
		errors.lastname = "Lastname is required";
	} else if (data.lastname.length < 3) {
		errors.lastname = "Lastname must be at least 3 characters long";
	}

	if (!data?.email?.trim()) {
		errors.email = "Email is required";
	} else if (!/\S+@\S+\.\S+/.test(data.email)) {
		errors.email = "Email is invalid";
	}

	if (!data?.phone.trim()) {
		errors.phone = "Phone number is required";
	} else if (data?.phone?.length < 12) {
		errors.phone = `Phone number must have 9 - 10 numbers after +${data.dialCode}`;
	}

	if (data.country?.length < 1 || !data?.country[0]?.name) {
		errors.country = "Country is required";
	}

	return errors;
}

export function validateBankForm(data, _) {
	const errors = {};

	if (data.bankName.length < 1 && !data.bankName.bankname) {
		errors.bankName = "Bank Name is required";
	}

	if (!data.accountNumber) {
		errors.accountNumber = "Account Number is required";
	} else if (data.accountNumber.length < 10) {
		errors.accountNumber = "Account Number must be 10 Numbers";
	}
	
	if (!data.accountName.trim()) {
		errors.accountName = "Account Name is required";
	} else if (data.accountName.length < 3) {
		errors.accountName = "Account Name must be more than 3 Letters!";
	}

	return errors;
}

export function validateStoreDetailsForm(data) {
	let errors = {};

	if (!data.name) {
		errors.name = "Business name is required";
	} else if (data.name.length < 3) {
		errors.name = "Business name must be more than 3 characters long";
	} else if (
		data?.name?.toLowerCase() == "quicka" || data?.name?.toLowerCase().includes("quicka")
	) {
		errors.name = "Quicka is a reserved name and connot be used!";
	}
	
	if (data?.category?.length < 1 && !data?.category?.name) {
		errors.category = "Choosing a store category is required";
	}

	if (!data?.phone.trim()) {
		errors.phone = "Phone number is required";
	} else if (data?.phone.length < 12) {
		errors.phone = `Phone number must have 9 - 10 numbers after +${data.dialCode}`;
	}

	return errors;
}

export function validateExportCsvInput(email) {
	let error;

	if (!email.trim()) {
		error = "An email address is required";
	} else if (!/\S+@\S+\.\S+/.test(email)) {
		error = "Email address is invalid!";
	}

	return error;
}

export function validateCollectionForm(name) {
	let error;

	if (!name.trim()) {
		error = "Collection name is required";
	} else if (name.length < 3) {
		error = "Collection name must be at least 3 characters long";
	}

	return error;
}


export function validateDiscountForm(data, currency) {
	const errors = {};

	if (!data.title.trim()) {
		errors.title = "Discount title is required";
	} else if (data.title.length < 3) {
		errors.title = "Discount title must be more than 3 characters!";
	}

	if (data.discountType == "no-discount") {
		errors.discountType = "A discount type is required";
	}

	if (data.discountType != "no-discount" && !data.discountValue) {
		errors.discountValue = "Discount value is required";
	} else if (data.discountType != "no-discount" && Number(data.discountValue) < 1) {
		errors.discountValue = `Discount value cannot be ${data.discountType == "percentage" ? "0%" : currency + "0"}`;
	}

	if (data.selectionType != "all" && data.discountProducts.length < 1) {
		errors.discountProducts = "Select at least one product for discount";
	}

	if (data.setvalidity && !data.startDate) {
		errors.startDate = "Start Date is required";
	} 
	
	if (data.setvalidity && !data.endDate) {
		errors.endDate = "End Date is required";
	}

	return errors;
}

export function validateCouponForm(data, currency) {
	const errors = {};

	if (!data.title.trim()) {
		errors.title = "Coupon title is required";
	} else if (data.title.length < 3) {
		errors.title = "Coupon title must be more than 3 characters!";
	}

	if (!data.couponCode) {
		errors.couponCode = "Generate a coupon code";
	}

	if (data.couponType == "none") {
		errors.couponType = "Select a coupon type";
	}

	if (data.couponType != "none" && !data.couponValue) {
		errors.couponValue = "Coupon value is required";
	} else if (data.couponType != "none" && Number(data.couponValue) < 1) {
		errors.couponValue = `Coupon value cannot be ${data.couponType == "percentage" ? "0%" : currency + "0"}`;
	}
	
	if (data.couponGroup == "collections" && data.couponCollection.length < 1) {
		errors.couponCollection = "Select at least one product collection for this coupon";
	}
	if (data.couponGroup == "single" && data.couponProducts.length < 1) {
		errors.couponProducts = "Select at least one product for this coupon";
	}
	if (data.couponGroup == "bundle" && data.couponProducts.length < 2) {
		errors.couponProducts = "Select at least (2) products for this coupon";
	}

	if (data.setvalidity && !data.startDate) {
		errors.startDate = "Start Date is required";
	} 
	
	if (data.setvalidity && !data.endDate) {
		errors.endDate = "End Date is required";
	}

	return errors;
}

export function validateExpensesForm(data, currency) {
	const errors = {};

	if (!data.title.trim()) {
		errors.title = "Expenses title is required";
	} else if (data.title.length < 3) {
		errors.title = "Expenses title must be more than 3 characters!";
	}

	if (!data.amount) {
		errors.amount = "Expenses amount is required";
	} else if (Number(data.amount) < 1) {
		errors.amount = `Expenses amount cannot be ${currency}0`;
	}

	if (!data.date) {
		errors.date = "Expenses Date is required";
	}
	
	return errors;
}
