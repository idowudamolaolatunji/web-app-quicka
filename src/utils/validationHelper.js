export function validateOnboardForm(data, type) {
	const errors = {};

	if (!data.name.trim()) {
		errors.name = "Business name is required";
	} else if (data.name.length < 3) {
		errors.name = "Business name must be more than 3 characters long";
	} else if (data.name.trim() && !data.storeUrl) {
		errors.storeUrl = "A URL is needed for your store";
	}

	if (data.isRegistered == "yes" && !data.regType) {
		errors.type = "Registeration type is required";
	}
	if (data.selectedCategory.length < 1 && !data.selectedCategory.name) {
		errors.category = "Picking a category is required";
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

		if (!data.phone.trim()) {
			errors.phone = "Phone number is required";
		} else if (data.phone.length < 12) {
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

	if (data.discountType != "no-discount" && !data.discount) {
		errors.discount = "Discount is required";
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
			if(product?.stockAmount < 1) {
				errors.orderProducts = `Item ${i+1} is out of stock`;
			} else if(product?.stockAmount < data?.productQuantities[i]?.quantity) {
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

	if (!data.phone.trim()) {
		errors.phone = "Phone number is required";
	} else if (data.phone.length < 12) {
		errors.phone = `Phone number must have 9 - 10 numbers after +${data.dialCode}`;
	}

	if (!data.country || data.country.length < 1 || !data.country[0].name) {
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