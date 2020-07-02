export class Configuration {
	static environments = {
		sandbox: Environment.SANDBOX,
		production: Environment.PRODUCTION
	};

	static defaultProperties = [
		'environment',
		'apiKey',
		'publicKey',
		'accessToken',
		'verifySSL',
		'timeout',
		'debugging',
		'userAgent',
		'origin',
		'securityCode',
		'serviceProviderCode',
		'initiatorIdentifier'
	];

	constructor(args) {
		this.environment = Configuration.environments.sandbox;
		this.verifySSL = false;
		this.timeout = 0;
		this.debugging = true;
		this.origin = '*';
		this.userAgent = 'MPesa';

		this.buildDefaultHeaders();
		this.buildDefaultOperations();
		
		
		if (args !== null && args !== undefined) {

			for (let key of Configuration.defaultProperties) {
				if (args.hasOwnProperty(key)) { 
					if (key == 'environment') {
						this.key = Environment.fromURL(args[key]);
					} else {
						this[key] = args[key]; 
					}
				}
			}
		}
		
		this.configureLogger(); 
	}
	
	configureLogger() {
		if (this.debugging) {
			Logger.enable = true;
		} else {
			Logger.enable = false;
		}
	}

	buildDefaultOperations() {
		this.defaultOperations = {
			C2B_PAYMENT: new Operation({
				name: 'c2bPayment', 
				method: 'POST', 
				port: '18352', 
				path: '/ipg/v1x/c2bPayment/singleStage',
				input: {					
					mapping: {
						number: 'input_CustomerMSISDN',
						from: 'input_CustomerMSISDN', 
						to: 'input_ServiceProviderCode', 
						amount: 'input_Amount',
						transaction: 'input_TransactionReference',
						reference: 'input_ThirdPartyReference'					
					},
					validation: {
						from: Patterns.PHONE_NUMBER,
						to: Patterns.SERVICE_PROVIDER_CODE,
						amount: Patterns.MONEY_AMOUNT,
						transaction: Patterns.WORD,
						reference: Patterns.WORD
					},
					type: 'body',				
				},

				outputMapping: {
				
				}
			}),
			QUERY_TRANSACTION_STATUS: new Operation({
				name: 'queryTransactionStatus', 
				method: 'GET', 
				port: '18353', 
				path: '/ipg/v1x/queryTransactionStatus',
				input: {
					mapping: {
						reference: 'input_QueryReference',
						conversation: 'input_QueryReference',
						transaction: 'input_QueryReference',
						from: 'input_ServiceProviderCode',
						system: 'input_ThirdPartyReference'				
					},				
					validation: {
						from: Patterns.PHONE_NUMBER,
						to: Patterns.SERVICE_PROVIDER_CODE,
						amount: Patterns.MONEY_AMOUNT,
						transaction: Patterns.WORD,
						reference: Patterns.WORD
					},
					type: 'query'
				},				
				outputMapping: {
			
				}
			}),
			REVERSAL: new Operation({
				name: 'reversal', 
				method: 'POST', 
				port: '18354', path: '/ipg/v1x/reversal',
				input: {
					mapping: {
						from: 'input_ServiceProviderCode',
						to: 'input_CustomerMSISDN', 
						amount: 'input_Amount',
						transaction: 'input_TransactionReference',
						reference: 'input_ThirdPartyReference'
					},
					validation: {
						from: Patterns.PHONE_NUMBER,
						to: Patterns.SERVICE_PROVIDER_CODE,
						amount: Patterns.MONEY_AMOUNT,
						transaction: Patterns.WORD,
						reference: Patterns.WORD
					},
					type: 'body'
				},

				outputMapping: {
				}
			}),
			B2B_PAYMENT: new Operation({
				name: 'b2bPayment', 
				method: 'GET', 
				port: '18349', 
				path: '/ipg/v1x/b2bPayment',
				input: {
					mapping: {
						from: 'input_PrimaryPartyCode',
						to: 'input_ReceiverPartyCode', 
						amount: 'input_Amount',
						transaction: 'input_TransactionReference',
						reference: 'input_ThirdPartyReference'
					},
					validation: {
						from: Patterns.SERVICE_PROVIDER_CODE,
						to: Patterns.SERVICE_PROVIDER_CODE,
						amount: Patterns.MONEY_AMOUNT,
						transaction:  Patterns.WORD,
						reference: Patterns.WORD
					},
					type: 'body'
				},
				output: {
				}
			}),
			B2C_PAYMENT: new Operation({
				name: 'b2cPayment', 
				method: 'GET', 
				port: '18345', 
				path: '/ipg/v1x/b2cPayment',
				input: {
					mapping: {
						from: 'input_ServiceProviderCode',
						to: 'input_CustomerMSISDN', 
						amount: 'input_Amount',
						transaction: 'input_TransactionReference',
						reference: 'input_ThirdPartyReference'
					},
					validation: {	
						to: Patterns.PHONE_NUMBE,
						from: Patterns.SERVICE_PROVIDER_CODE,
						amount: Patterns.MONEY_AMOUNT,
						transaction: Patterns.WORD,
						reference: Patterns.WORD
					},
					type: 'body'
				},
				outputMapping: {
				}
			}),
		};
	}

	buildDefaultHeaders() {
		this.defaultHeaders = {
			'Origin': this.origin,
			'User-Agent': this.userAgent
		};	
	}

	generateAuthorizationHeader() {
		if (this.isAuthenticationDataValid()) {
			return {'Authorization': `Bearer ${this.accessToken}`};
		}

		throw 'Does not have API Key and Public key or access token';
	}

	generateHeaders() {
		return {
			...this.defaultHeaders,
			...this.generateAuthorizationHeader()
		};
	}

	generateURL(operation) {
		return `${this.environment.toURL()}${operation.toURL()}`;
	}

	isAuthenticationDataValid() {
		return (this.apiKey != null && this.publicKey != null) || this.accessToken != null;
	}

	isValid() {
		return this.isAuthenticationDataValid();
	}

	generateBaseURL(operation) {
		return `${this.environment.toURL()}:${operation.port}`
	}
}