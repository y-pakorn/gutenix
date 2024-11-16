import qrcode
from PIL import Image


def create_qr_code(data, filename='qr_code.png', fill_color='black', back_color='white', box_size=10, border=4, version=1):
    """
    Create a QR code with customizable parameters

    Parameters:
    data (str): The data to encode in the QR code
    filename (str): Output filename for the QR code image
    fill_color (str): Color of the QR code (default: black)
    back_color (str): Background color (default: white)
    box_size (int): Size of each box in pixels (default: 10)
    border (int): Border size in boxes (default: 4)
    version (int): QR code version 1-40 (default: 1)

    Returns:
    PIL.Image: Generated QR code image
    """
    qr = qrcode.QRCode(
        version=version,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=box_size,
        border=border,
    )

    # Add data to the QR code
    qr.add_data(data)
    qr.make(fit=True)

    # Create the QR code image
    qr_image = qr.make_image(fill_color=fill_color, back_color=back_color)

    # Save the image
    qr_image.save(filename)

    return qr_image


# Example usage:
if __name__ == "__main__":
    # Basic usage
    create_qr_code("https://forms.gle/WbFuqgXGABsfxxZ67", "basic_qr.png")
