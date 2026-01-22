
import struct
import imghdr
import os

def get_image_size(fname):
    try:
        with open(fname, 'rb') as fhandle:
            head = fhandle.read(24)
            if len(head) != 24:
                return
            what = imghdr.what(fname)
            if what == 'png':
                check = struct.unpack('>i', head[4:8])[0]
                if check != 0x0d0a1a0a:
                    return
                width, height = struct.unpack('>ii', head[16:24])
            elif what == 'gif':
                width, height = struct.unpack('<HH', head[6:10])
            elif what == 'jpeg':
                fhandle.seek(0)
                size = 2
                ftype = 0
                while not 0xc0 <= ftype <= 0xcf:
                    fhandle.seek(size, 1)
                    byte = fhandle.read(1)
                    while ord(byte) == 0xff:
                        byte = fhandle.read(1)
                    ftype = ord(byte)
                    size = struct.unpack('>H', fhandle.read(2))[0] - 2
                fhandle.seek(1, 1)
                height, width = struct.unpack('>HH', fhandle.read(4))
            else:
                return
            return width, height
    except Exception as e:
        return None

for root, dirs, files in os.walk('.'):
    for name in files:
        if name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            path = os.path.join(root, name)
            if "node_modules" in path: continue
            size = get_image_size(path)
            if size:
                print(f"{path}: {size[0]}x{size[1]}")
