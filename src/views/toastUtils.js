// toastUtils.js or App.js
import { toast } from 'react-toastify'

export const callToasterAlert = (msg, type = 1) => {
  const commonOptions = {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  }

  if (type === 1) {
    toast.success(msg, commonOptions)
  } else if (type === 2) {
    toast.error(msg, commonOptions)
  } else {
    toast(msg, commonOptions) // fallback
  }
}
