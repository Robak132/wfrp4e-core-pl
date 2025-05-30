Hooks.on("init", () => {
	if (typeof Babele !== "undefined") {
		game.babele.register({
			module: "wfrp4e-core-pl",
			lang: "pl",
			dir: "compendium",
		});
	}

	class CompendiumMapping {

		constructor(entityType, mapping, tc) {
			this.mapping = foundry.utils.mergeObject(game.babele.constructor.DEFAULT_MAPPINGS[entityType], mapping || {});
			this.fields = Object.keys(this.mapping).map(key => new FieldMapping(key, this.mapping[key], tc));
		}

		map(data, translations) {
			return this.fields.reduce((m, f) => foundry.utils.mergeObject(m, f.map(data, translations)), {});
		}
		
		translateField(field, data, translations) {
			return this.fields.find(f => f.field === field)?.translate(data, translations);
		}
		
		extractField(field, data) {
			return this.fields.find(f => f.field === field)?.extractValue(field, data);
		}

		extract(data) {
			return this.fields
				.filter(f => !f.isDynamic())
				.reduce((m, f) => foundry.utils.mergeObject(m, f.extract(data)), {});
		}

		isDynamic() {
			return this.fields.map(f => f.isDynamic()).reduce((result, dynamic) => result || dynamic, false);
		}
	}

	class FieldMapping {

		constructor(field, mapping, tc) {
			this.field = field;
			this.tc = tc;
			if (typeof mapping === "object") {
				this.path = mapping["path"];
				this.converter = game.babele.converters[mapping["converter"]];
				this.dynamic = true;
			} else {
				this.path = mapping;
				this.converter = null;
				this.dynamic = false;
			}
		}

		map(data, translations) {
			const map = {};
			const value = this.translate(data, translations);
			if (value) {
				this.path.split('.').reduce((a, f, i, r) => {
					a[f] = (i < r.length - 1) ? {} : value;
					return a[f];
				}, map);
			}
			return map;
		}
		
		translate(data, translations) {
			const originalValue = this.extractValue(data);
			let value;
			if (this.converter && originalValue) {
				value = this.converter(originalValue, translations[this.field], data, this.tc, translations)
			} else {
				value = translations[this.field];
			}
			return value;
		}
		
		extractValue(data) {
			return this.path.split('.').reduce((o, k) => {
				return o && o[k];
			}, data);
		}
		
		extract(data) {
			const extract = {};
			extract[this.field] = this.extractValue(data);
			return extract;
		}
		
		isDynamic() {
			return this.dynamic;
		}
	}
	
	Reflect.defineProperty(WarhammerModuleInitializer.prototype, 'createFolders', { value:
		function (pack) {
			let root = game.modules.get(pack.metadata.packageName).flags.folder;
			root.type = pack.metadata.type;
			root._id = randomID();
			root.flags = {source : this.data.module.id};

			this.rootFolders[pack.metadata.id] = root._id;
			const data = {name: root.name};
			let packsFolderJson = game.babele.packs.get(pack.metadata.packageName + "._packs-folders");
			if (packsFolderJson) {
				root.name = packsFolderJson.translations[data.name] || root.name;
				let packFolders = pack.folders.contents.map(f => f.toObject());
				for (let f of packFolders) {
					if (!f.folder) {
						f.folder = root._id;
						f.name = pack.folders.contents.find(x => x._id == f._id).name;
					}
					f.flags.source = this.data.module.id;
				}
				return Folder.create(packFolders.concat(root), {keepId : true})
			} else {
				let packFolders = pack.folders.contents.map(f => f.toObject());
				for(let f of packFolders) {
					if (!f.folder) {
						f.folder = root._id;
					}
					f.flags.source = this.data.module.id;
				}
				return Folder.create(packFolders.concat(root), {keepId : true})
			}
		}
	});

	game.babele.loadTranslations = async function () {
		const getTranslationsFiles = async (babele) => {
			if (!game.user.hasPermission('FILES_BROWSE')) {
				return game.settings.get('babele', 'translationFiles');
			}
	
			const lang = game.settings.get('core', 'language');
			const directory = game.settings.get('babele', 'directory');
			const directories = babele.modules
				.filter(module => module.lang === lang)
				.map(module => `modules/${module.module}/${module.dir}`);
	
			if (directory && directory.trim && directory.trim()) {
				directories.push(`${directory}/${lang}`);
			}
	
			if (babele.systemTranslationsDir) {
				directories.push(`systems/${game.system.id}/${babele.systemTranslationsDir}/${lang}`);
			}
	
			const files = [];
	
			for (let i = 0; i < directories.length; i++) {
				try {
					let result = await FilePicker.browse('data', directories[i]);
					result.files.forEach(file => files.push(file));
				} catch (err) {
					console.warn('Babele: ' + err);
				}
			}
	
			if (game.user.isGM) {
				game.settings.set('babele', 'translationFiles', files);
			}
	
			return files;
		}

        const files = await getTranslationsFiles(this);

        if (files.length === 0) {
            console.log(`Babele | no compendium translation files found for ${game.settings.get('core', 'language')} language.`);

            return [];
        }

        const allTranslations = [];
        const loadTranslations = async (collection, urls) => {
            if (urls.length === 0) {
                console.log(`Babele | no translation file found for ${collection} pack`);
            } else {
                const [translations] = await Promise.all(
                    [Promise.all(urls.map((url) => fetch(url).then((r) => r.json()).catch(e => {
                    })))],
                );

                let translation = {};
                translations.forEach(t => {foundry.utils.mergeObject(translation, t)})
				console.log(`Babele | translation for ${collection} pack successfully loaded`);
				allTranslations.push(foundry.utils.mergeObject(translation, { collection: collection }));
            }
        };

        for (const metadata of game.data.packs) {
            if (this.supported(metadata)) {
                const collection = this.getCollection(metadata);
                const collectionFileName = encodeURI(`${collection}.json`);
                const urls = files.filter(file => file.endsWith(collectionFileName));

                await loadTranslations(collection, urls);
            }
        }

        // Handle specific files for pack folders
        for (const file of files.filter((file) => file.endsWith(`${Babele.PACK_FOLDER_TRANSLATION_NAME_SUFFIX}.json`))) {
            const fileName = file.split('/').pop();

            await loadTranslations(fileName.replace('.json', ''), [file]);
        }

		const getMappingFiles = async (babele) => {
			if (!game.user.hasPermission('FILES_BROWSE')) {
				return game.settings.get('babele', 'mappingFiles');
			}
	
			const directory = game.settings.get('babele', 'directory');
			const directories = babele.modules
				.map(module => `modules/${module.module}/${module.dir}`);
	
			if (directory && directory.trim && directory.trim()) {
				directories.push(`${directory}`);
			}
	
			if (babele.systemTranslationsDir) {
				directories.push(`systems/${game.system.id}/${this.systemTranslationsDir}`);
			}
	
			const files = [];
			for (let i = 0; i < directories.length; i++) {
				try {
					let result = await FilePicker.browse('data', directories[i]);
					result.files
						.filter(file => file.endsWith('/mapping.json'))
						.forEach(file => files.push(file));
				} catch (err) {
					console.warn('Babele: ' + err);
				}
			}
	
			if (game.user.isGM) {
				game.settings.set('babele', 'mappingFiles', files);
			}
	
			return files;
		}
	
		
        // Handle global mappings
        const mappingFiles = await getMappingFiles(this);

        if (mappingFiles.length > 0) {
            console.log(`Babele | global mapping files found, defaults will be enriched/overwritten...`);

            const loadMappings = async () => {
                const [mappings] = await Promise.all(
                    [Promise.all(mappingFiles.map((file) => fetch(file).then((r) => r.json()).catch(e => {
                    })))],
                );
                mappings.forEach(mapping => {
                    this.registerMapping(mapping);
                })
            }
            await loadMappings();
        }

        return allTranslations;
    }

	game.babele.registerConverters({
		effects: (effects, translations) => {
			return effects.map((data) => {
				if (translations){
					const translation = translations[data.name] || translations[data.id] || translations[data._id];
					if (translation) {
						let result = foundry.utils.deepClone(data);
						result.translated = true;
						if (translation.name) {
							result.name = translation.name;
						}
						if (translation.filter) {
							result.system.transferData.filter = translation.filter;
						}
						if (translation.enableConditionScript) {
							result.system.transferData.enableConditionScript = translation.enableConditionScript;
						}
						if (translation.preApplyScript) {
							result.system.transferData.preApplyScript = translation.preApplyScript;
						}
						if (translation.scriptData) {
							for (let i = 0; i < translation.scriptData.length; i++) {
								let transScript = translation.scriptData[i];
								let script = result.system.scriptData[i];
								if (script) {
									script.label = transScript.name;
									if (transScript.hideScript) {
										script.options.hideScript = transScript.hideScript;
									}
									if (transScript.activationScript) {
										script.options.activateScript = transScript.activationScript;
									}
									if (transScript.submissionScript) {
										script.options.submissionScript = transScript.submissionScript;
									}
									script.script = transScript.script;
								}
							}
						}
						return result;
					}
				}
				return data;
			});
		},

		notes: (notes, translations) => {
			// TODO: notes on map.
			return notes.map((data) => {
				if (translations){ 
					const translation = translations[data.id] ?? translations[data._id];
					if (translation) {
						return foundry.utils.mergeObject(
							data,
							foundry.utils.mergeObject(translation, { translated: true }),
						);
					}
				}
				return data;
			});
		},
		
		bestiary_traits: (items, translations) => {
			const translatedItems = game.babele.converters.fromPack(items, translations);
			const dynamicMapping = new CompendiumMapping("Item", null);
			const toTranslate = translatedItems.filter(x => translations[x.id] != null || translations[x._id] != null)

			for (let i = 0; i < toTranslate.length; i++) {
				const item = toTranslate[i];
				const pack = game.babele.packs.find(pack => pack.translated && pack.hasTranslation(item));
				if (pack) {
					const originalName = item.name;
					let translatedItem = pack.translations[originalName];
					if (translatedItem) {
						const translatedData = dynamicMapping.map(item, translatedItem);
						translatedItem = foundry.utils.mergeObject(item, translatedData);
						for (const e of translatedItem.effects) {
							const te = pack.translations[originalName].effects[e._id];
							if (te) {
								foundry.utils.mergeObject(e, te);
								if (te.filter) {
									e.flags.wfrp4e.applicationData.filter = te.filter;
								}
								if (te.filter) {
									e.system.transferData.filter = te.filter;
								}
								if (te.enableConditionScript) {
									e.system.transferData.enableConditionScript = te.enableConditionScript;
								}
								if (te.preApplyScript) {
									e.system.transferData.preApplyScript = te.preApplyScript;
								}
								if (e.system.scriptData && te.scriptData) {
									for (let i = 0; i < te.scriptData.length; i++) {
										let transScript = te.scriptData[i];
										let script = e.system.scriptData[i];
										if (script) {
											script.label = transScript.name;
											if (transScript.hideScript) {
												script.options.hideScript = transScript.hideScript;
											}
											if (transScript.activationScript) {
												script.options.activateScript = transScript.activationScript;
											}
											if (transScript.submissionScript) {
												script.options.submissionScript = transScript.submissionScript;
											}
											script.script = transScript.script;
										}
									}
								}
							}
						}
						if ((translations[translatedItem.id] ?? translations[translatedItem._id]).specification) {
							translatedItem.system.specification.value = (translations[translatedItem.id] ?? translations[translatedItem._id]).specification;
						}
						if ((translations[translatedItem.id] ?? translations[translatedItem._id]).tests) {
							translatedItem.system.tests.value = (translations[translatedItem.id] ?? translations[translatedItem._id]).tests;
						}
					}
				} else {
					for (const pack of game.babele.packs) {
						const props = Object.getOwnPropertyNames(pack.translations);
						const itemsToCheck = [];
						for (const prop of props) {
							if (pack.translations[prop].name == item.name) { 
								itemsToCheck.push(pack.translations[prop]);
							}
						}
						for (const itemToCheck of itemsToCheck) {
							let compendiumItem = fromUuidSync(itemToCheck.sourceId);
							let compendiumItemId = compendiumItem._id;
							if (compendiumItem && compendiumItem.type == item.type) {
								let translatedItem = pack.translations[compendiumItemId];
								if (translatedItem) {
									const translatedData = dynamicMapping.map(item, translatedItem);
									translatedItem = foundry.utils.mergeObject(item, translatedData);
									for (const e of translatedItem.effects) {
										const te = pack.translations[compendiumItemId].effects[e._id];
										if (te) {
											foundry.utils.mergeObject(e, te);
											if (te.filter) {
												e.flags.wfrp4e.applicationData.filter = te.filter;
											}
											if (te.filter) {
												e.system.transferData.filter = te.filter;
											}
											if (te.enableConditionScript) {
												e.system.transferData.enableConditionScript = te.enableConditionScript;
											}
											if (te.preApplyScript) {
												e.system.transferData.preApplyScript = te.preApplyScript;
											}
											if (e.system.scriptData && te.scriptData) {
												for (let i = 0; i < te.scriptData.length; i++) {
													let transScript = te.scriptData[i];
													let script = e.system.scriptData[i];
													if (script) {
														script.label = transScript.name;
														if (transScript.hideScript) {
															script.options.hideScript = transScript.hideScript;
														}
														if (transScript.activationScript) {
															script.options.activateScript = transScript.activationScript;
														}
														if (transScript.submissionScript) {
															script.options.submissionScript = transScript.submissionScript;
														}
														script.script = transScript.script;
													}
												}
											}
										}
									}
									if ((translations[translatedItem.id] ?? translations[translatedItem._id]).specification) {
										translatedItem.system.specification.value = (translations[translatedItem.id] ?? translations[translatedItem._id]).specification;
									}
									if ((translations[translatedItem.id] ?? translations[translatedItem._id]).tests) {
										translatedItem.system.tests.value = (translations[translatedItem.id] ?? translations[translatedItem._id]).tests;
									}
									break;
								}
							}
						}
					}

				}
			}
			return translatedItems;
		},
		
		templateSkills: (skills, translations) => {
			if (skills.list) {
				let result = foundry.utils.deepClone(skills);
				for (let i = 0; i < result.list.length; i++) {
					result.list[i].name = translations[i];
				}
				return result;
			}
			else if (Array.isArray(skills)) {
				return translations;
			}
			return skills;
		},

		templateTalents: (talents, translations) => {
			if (talents.list) {
				let result = foundry.utils.deepClone(talents);
				for (let i = 0; i < result.list.length; i++) {
					result.list[i].name = translations[i];
				}
				return result;
			}
			else if (Array.isArray(talents)) {
				return translations;
			}
			return talents;
		},

		templateTraits: (traits, translations) => {
			if (traits.list) {
				let result = foundry.utils.deepClone(traits);
				for (let i = 0; i < result.list.length; i++) {
					result.list[i].name = translations[i];
				}
				return result;
			}
			else if (Array.isArray(traits)) {
				return translations;
			}
			return traits;
		},

		templateTrappings: (trappings, translations) => {
			if (trappings?.options) {
				let result = foundry.utils.deepClone(trappings);
				for (let i = 0; i < trappings.options.length; i++) {
					const o = trappings.options[i];
					const t = translations.find(t => t.Id == o.id);
					if (t) {
						result.options[i].name = t.Name;
					}
				}
				return result;
			}
			else if (Array.isArray(trappings)) {
				return translations;
			}
			return trappings;
		},
	});
});

(function disableCache() {
	console.log("BABELE: Disable cache");
	CompendiumCollection.CACHE_LIFETIME_SECONDS = 1;
})();


Hooks.on("ready", () => {
	setTimeout(() => {
		console.log("BABELE: Enable cache");
		CompendiumCollection.CACHE_LIFETIME_SECONDS = 300;

		game.packs.forEach(p => {
			p._flush = foundry.utils.debounce(p.clear.bind(p), CompendiumCollection.CACHE_LIFETIME_SECONDS * 100);
		});
	}, 1000);
});