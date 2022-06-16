const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());



app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});


app.use('*', (req,res) => {
  res.status(404).send('Not Found - 404 handler in server.js');
});

app.use((err, req, res, next) => {
  console.log(err);
  const defaultErr = {error: 'An error occur'};
  const errObj = Object.assign({}, defaultErr, err);
  console.log('errObj in global handler',errObj);
  res.status(500).json(errObj.error);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});