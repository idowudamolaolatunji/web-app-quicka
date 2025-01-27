import { BsCash } from 'react-icons/bs';
import { TbCashRegister, TbShoppingBagDiscount, TbTruckDelivery } from 'react-icons/tb';
import { RiBankLine } from 'react-icons/ri';
import { LuClipboardList, LuPackageCheck, LuReplaceAll, LuTag } from 'react-icons/lu';
import { MdOutlineBallot, MdOutlinePendingActions } from 'react-icons/md';
import { HiOutlineCollection } from 'react-icons/hi';

export const paymentMethodData = [
    { label: <p className='flex align'><BsCash /> Cash</p>, value: "cash" },
    { label: <p className='flex align'><RiBankLine /> Bank Transfer</p>, value: "bank-transfer", },
    { label: <p className='flex align'><TbCashRegister /> POS</p>, value: "pos" },
];

export const deliveryStatusData = [
    { label: <p className='flex align'><TbTruckDelivery /> In Transit</p>, value: "in-transit" },
    { label: <p className='flex align'><MdOutlinePendingActions /> Pending</p>, value: "pending" },
    { label: <p className='flex align'><LuPackageCheck /> Delivered</p>, value: "delivered" },
];

export const channelData = [
    { label: "facebook", value: "facebook" },
    { label: "instagram", value: "instagram" },
    { label: "jiji", value: "jiji" },
    { label: "physical shop", value: "physical shop" },
    { label: "whatsapp", value: "whatsapp" },
    { label: "flutterwave Store", value: "flutterwave" },
    { label: "twitter", value: "twitter" },
    { label: "jumia", value: "jumia" },
    { label: "konga", value: "konga" },
    { label: "others", value: "others" },
];

export const discountSelectionTypeData = [
    { label: <p className='flex align'><LuClipboardList /> All Products</p>, value: "all" },
    { label: <p className='flex align'><TbShoppingBagDiscount /> Select Products for discount</p>, value: "product-bundle" },
];


export const couponSelectionTypeData = [
    { label: <p className='flex align'><LuClipboardList /> All Products</p>, value: "all" },
    { label: <p className='flex align'><LuTag /> Single Product</p>, value: "single" },
    { label: <p className='flex align'><TbShoppingBagDiscount /> Select Products Bundle</p>, value: "bundle" },
    { label: <p className='flex align'><HiOutlineCollection /> Select Collections</p>, value: "collections" },
];