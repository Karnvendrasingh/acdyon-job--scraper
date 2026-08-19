import threading
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class MockSourceHandler(BaseHTTPRequestHandler):
    
    state = {
        "status": 200,
        "empty": False,
        "markup_version": "v1" # v1 or v2
    }

    def do_GET(self):
        if self.state["status"] != 200:
            self.send_response(self.state["status"])
            if self.state["status"] == 429:
                self.send_header('Retry-After', '1')
            self.end_headers()
            return
            
        if self.path == '/remoteok':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            if self.state["empty"]:
                self.wfile.write(b'[]')
            else:
                data = [{"legal": "yes"}, {"id": 1, "position": "Dev", "company": "Tech", "apply_url": "http://apply"}]
                self.wfile.write(json.dumps(data).encode('utf-8'))
                
        elif self.path == '/arbeitnow':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            if self.state["empty"]:
                self.wfile.write(b'{"data": []}')
            else:
                data = {"data": [{"title": "Eng", "company_name": "Corp", "url": "http://apply"}]}
                self.wfile.write(json.dumps(data).encode('utf-8'))
                
        elif self.path == '/html-mock':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            if self.state["markup_version"] == "v1":
                html = '<html><body><div class="job-list"><div class="job-item"><h2 class="title">Engineer</h2><span class="company">Google</span></div></div></body></html>'
            else:
                # Redesigned markup
                html = '<html><body><ul id="jobs-container"><li class="job-card"><h3 class="job-heading">Engineer</h3><div class="org-name">Google</div></li></ul></body></html>'
            self.wfile.write(html.encode('utf-8'))
            
        else:
            self.send_response(404)
            self.end_headers()

def start_mock_server(port=8080):
    server = HTTPServer(('localhost', port), MockSourceHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, MockSourceHandler.state
