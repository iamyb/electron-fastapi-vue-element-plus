import os   
import multiprocessing
from typing import Union

from pydantic import BaseModel
from datetime import datetime
import uvicorn

class FileInfo(BaseModel):
    fileName: str

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/dir")
def read_dir(file_info:FileInfo):
    dir_path = file_info.fileName

    file_list = []
    try:
        for entry in os.scandir(dir_path):
            file_info = {
                'name': entry.name,
                'path': entry.path,
                'size': entry.stat().st_size,
                'created': datetime.fromtimestamp(entry.stat().st_ctime),
                'modified': datetime.fromtimestamp(entry.stat().st_mtime),
                'type': 'file'
            }
            if entry.is_dir():
                file_info['type'] = 'directory'

            file_list.append(file_info)
    except OSError as e:
        print(f"Error accessing directory: {e}")

    return {'fileInfo':file_list}

if __name__ == "__main__":
    multiprocessing.freeze_support()
    uvicorn.run("__main__:app",
                host="127.0.0.1",
                port=8888,
                reload=True,
                log_config="uvicorn_log.ini")